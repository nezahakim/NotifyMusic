const JAMENDO_CLIENT_ID = "e1372904";
const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";
const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

let spotifyToken = "";

// Use a more robust caching mechanism
const cache = {
  data: new Map(),
  audio: new Map(),
  set: (key, value, expirationInMinutes = 60) => {
    const item = {
      value,
      expiry: new Date().getTime() + expirationInMinutes * 60000,
    };
    localStorage.setItem(key, JSON.stringify(item));
    cache.data.set(key, item);
  },
  get: (key) => {
    const cachedItem = cache.data.get(key) || JSON.parse(localStorage.getItem(key));
    if (!cachedItem) return null;
    if (new Date().getTime() > cachedItem.expiry) {
      cache.data.delete(key);
      localStorage.removeItem(key);
      return null;
    }
    return cachedItem.value;
  },
};

const getSpotifyToken = async () => {
  if (spotifyToken) return spotifyToken;
  const cachedToken = cache.get("spotifyToken");
  if (cachedToken) return cachedToken;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  spotifyToken = data.access_token;
  cache.set("spotifyToken", spotifyToken, 50); // Cache for 50 minutes
  return spotifyToken;
};

const fetchWithCache = async (url, options = {}) => {
  const cacheKey = url + JSON.stringify(options);
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
};

const fetchFromJamendo = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    ...params,
  });
  return fetchWithCache(`${JAMENDO_BASE_URL}${endpoint}?${queryParams}`);
};

const fetchFromSpotify = async (endpoint, params = {}) => {
  const token = await getSpotifyToken();
  const queryParams = new URLSearchParams(params);
  return fetchWithCache(`${SPOTIFY_BASE_URL}${endpoint}?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const preloadAudio = (url) => {
  if (cache.audio.has(url)) return;
  const audio = new Audio();
  audio.preload = "auto";
  audio.src = url;
  cache.audio.set(url, audio);
};

const findBestSpotifyMatch = (jamendoTrack, spotifyTracks) => {
  if (!spotifyTracks || spotifyTracks.length === 0) return null;
  return spotifyTracks.reduce((best, current) => {
    const currentScore = calculateMatchScore(jamendoTrack, current);
    const bestScore = calculateMatchScore(jamendoTrack, best);
    return currentScore > bestScore ? current : best;
  });
};

const calculateMatchScore = (jamendoTrack, spotifyTrack) => {
  let score = 0;
  if (jamendoTrack.name.toLowerCase() === spotifyTrack.name.toLowerCase()) score += 3;
  else if (
    jamendoTrack.name.toLowerCase().includes(spotifyTrack.name.toLowerCase()) ||
    spotifyTrack.name.toLowerCase().includes(jamendoTrack.name.toLowerCase())
  ) score += 2;
  if (jamendoTrack.artist_name.toLowerCase() === spotifyTrack.artists[0].name.toLowerCase()) score += 3;
  else if (
    jamendoTrack.artist_name.toLowerCase().includes(spotifyTrack.artists[0].name.toLowerCase()) ||
    spotifyTrack.artists[0].name.toLowerCase().includes(jamendoTrack.artist_name.toLowerCase())
  ) score += 2;
  const durationDiff = Math.abs(jamendoTrack.duration - spotifyTrack.duration_ms / 1000);
  if (durationDiff <= 5) score += 2;
  return score;
};

// Worker for background processing
const worker = new Worker(
  URL.createObjectURL(
    new Blob(
      [
        `
        self.onmessage = async function(e) {
          const { type, data } = e.data;
          if (type === 'fetchSpotifyData') {
            const { trackName, artistName } = data;
            const response = await fetch('${SPOTIFY_BASE_URL}/search?q=track:' + encodeURIComponent(trackName) + ' artist:' + encodeURIComponent(artistName) + '&type=track&limit=5', {
              headers: { 'Authorization': 'Bearer ' + '${await getSpotifyToken()}' }
            });
            const result = await response.json();
            self.postMessage({ type: 'spotifyDataFetched', data: result });
          }
        }
      `,
      ],
      { type: "application/javascript" },
    ),
  ),
);

worker.onmessage = function (e) {
  const { type, data } = e.data;
  if (type === "spotifyDataFetched") {
    // Handle the Spotify data here
    console.log("Spotify data fetched in background:", data);
  }
};

export const fetchPlaylist = async (limit = 20, offset = 0) => {
  try {
    const jamendoData = await fetchFromJamendo("/tracks/", {
      limit,
      offset,
      order: "popularity_total",
    });
    const playlist = jamendoData.results.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      albumCover: track.image,
      audioUrl: track.audio,
      duration: track.duration,
      album: track.album_name,
      releaseDate: track.releasedate,
      genre: track.genre,
    }));

    // Preload audio and fetch Spotify data in the background
    playlist.forEach((track, index) => {
      if (index < 5) preloadAudio(track.audioUrl); // Preload first 5 tracks
      worker.postMessage({
        type: "fetchSpotifyData",
        data: { trackName: track.title, artistName: track.artist },
      });
    });

    return playlist;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
};

export const fetchLyrics = async (trackId) => "Lyrics are not available through the Jamendo API.";

export const getTrackInfo = async (trackId) => {
  try {
    const jamendoData = await fetchFromJamendo(`/tracks/`, { id: trackId });
    const track = jamendoData.results[0];
    preloadAudio(track.audio);
    return {
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      albumCover: track.image,
      duration: track.duration,
      audioUrl: track.audio,
      releaseDate: track.releasedate,
      genre: track.genre,
    };
  } catch (error) {
    console.error("Error getting track info:", error);
    return null;
  }
};

// Function to load more tracks (for infinite scrolling)
export const loadMoreTracks = async (offset) => {
  return fetchPlaylist(20, offset);
};
