const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const JAMENDO_CLIENT_ID = "e1372904";
const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";
let spotifyToken = "";

const cache = new Map();
const audioCache = new Map();

const getSpotifyToken = async () => {
  if (spotifyToken) return spotifyToken;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  spotifyToken = data.access_token;
  return spotifyToken;
};

const fetchWithCache = async (url, options = {}) => {
  const cacheKey = url + JSON.stringify(options);
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
};

const fetchFromSpotify = async (endpoint, params = {}) => {
  const token = await getSpotifyToken();
  const queryParams = new URLSearchParams(params);
  return fetchWithCache(`${SPOTIFY_BASE_URL}${endpoint}?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const fetchFromJamendo = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    ...params,
  });
  return fetchWithCache(`${JAMENDO_BASE_URL}${endpoint}?${queryParams}`);
};

const preloadAudio = (url) => {
  if (audioCache.has(url)) return;
  const audio = new Audio(url);
  audio.preload = "auto";
  audioCache.set(url, audio);
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
  if (jamendoTrack.name.toLowerCase() === spotifyTrack.name.toLowerCase())
    score += 3;
  else if (
    jamendoTrack.name.toLowerCase().includes(spotifyTrack.name.toLowerCase()) ||
    spotifyTrack.name.toLowerCase().includes(jamendoTrack.name.toLowerCase())
  )
    score += 2;
  if (
    jamendoTrack.artist_name.toLowerCase() ===
    spotifyTrack.artists[0].name.toLowerCase()
  )
    score += 3;
  else if (
    jamendoTrack.artist_name
      .toLowerCase()
      .includes(spotifyTrack.artists[0].name.toLowerCase()) ||
    spotifyTrack.artists[0].name
      .toLowerCase()
      .includes(jamendoTrack.artist_name.toLowerCase())
  )
    score += 2;
  const durationDiff = Math.abs(
    jamendoTrack.duration - spotifyTrack.duration_ms / 1000,
  );
  if (durationDiff <= 5) score += 2;
  return score;
};

export const fetchPlaylist = async () => {
  try {
    const jamendoData = await fetchFromJamendo("/tracks/", {
      limit: 20,
      order: "popularity_total",
    });
    const playlist = await Promise.all(
      jamendoData.results.map(async (track) => {
        const spotifyData = await fetchFromSpotify("/search", {
          q: `track:${track.name} artist:${track.artist_name}`,
          type: "track",
          limit: 5,
        });
        const bestSpotifyMatch = findBestSpotifyMatch(
          track,
          spotifyData.tracks?.items,
        );
        preloadAudio(track.audio);
        return {
          id: track.id,
          title: track.name,
          artist: track.artist_name,
          albumCover: bestSpotifyMatch?.album.images[1]?.url || track.image,
          audioUrl: track.audio,
          duration: track.duration,
          album: track.album_name,
          releaseDate: track.releasedate,
          genre: track.genre,
          spotifyId: bestSpotifyMatch?.id || null,
        };
      }),
    );
    return playlist;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
};

export const fetchLyrics = async (trackId) =>
  "Lyrics are not available through the Jamendo API.";

export const getTrackInfo = async (trackId) => {
  try {
    const [jamendoData, spotifyData] = await Promise.all([
      fetchFromJamendo(`/tracks/`, { id: trackId }),
      fetchFromSpotify("/search", {
        q: `track:${trackId}`,
        type: "track",
        limit: 5,
      }),
    ]);
    const jamendoTrack = jamendoData.results[0];
    const bestSpotifyMatch = findBestSpotifyMatch(
      jamendoTrack,
      spotifyData.tracks?.items,
    );
    preloadAudio(jamendoTrack.audio);
    return {
      id: jamendoTrack.id,
      title: jamendoTrack.name,
      artist: jamendoTrack.artist_name,
      album: jamendoTrack.album_name,
      albumCover: bestSpotifyMatch?.album.images[1]?.url || jamendoTrack.image,
      duration: jamendoTrack.duration,
      audioUrl: jamendoTrack.audio,
      releaseDate: jamendoTrack.releasedate,
      genre: jamendoTrack.genre,
      spotifyId: bestSpotifyMatch?.id || null,
    };
  } catch (error) {
    console.error("Error getting track info:", error);
    return null;
  }
};
