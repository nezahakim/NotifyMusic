const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const JAMENDO_CLIENT_ID = "YOUR_JAMENDO_CLIENT_ID";
const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";

let spotifyToken = "";
const spotifyCache = new Map();

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

const fetchFromSpotify = async (endpoint, params = {}) => {
  const token = await getSpotifyToken();
  const queryParams = new URLSearchParams(params);
  const cacheKey = `${endpoint}?${queryParams}`;
  if (spotifyCache.has(cacheKey)) return spotifyCache.get(cacheKey);

  const response = await fetch(
    `${SPOTIFY_BASE_URL}${endpoint}?${queryParams}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  spotifyCache.set(cacheKey, data);
  return data;
};

const fetchFromJamendo = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    ...params,
  });
  const response = await fetch(`${JAMENDO_BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

const findJamendoMatch = async (spotifyTrack) => {
  const jamendoData = await fetchFromJamendo("/tracks/", {
    search: `${spotifyTrack.name} ${spotifyTrack.artists[0].name}`,
    limit: 1,
  });
  return jamendoData.results[0];
};

const preloadAudio = (url) => {
  const audio = new Audio();
  audio.preload = "auto";
  audio.src = url;
  return new Promise((resolve) => {
    audio.oncanplaythrough = resolve;
    audio.onerror = resolve;
  });
};

export const fetchPlaylist = async () => {
  try {
    const trendingTracks = await fetchFromSpotify("/browse/new-releases", {
      limit: 20,
    });

    const playlist = await Promise.all(
      trendingTracks.albums.items
        .flatMap((album) => album.tracks.items)
        .slice(0, 20)
        .map(async (track) => {
          const jamendoTrack = await findJamendoMatch(track);

          if (jamendoTrack) {
            preloadAudio(jamendoTrack.audio);
          }

          return {
            id: jamendoTrack?.id || track.id,
            title: track.name,
            artist: track.artists[0].name,
            albumCover: track.album.images[1]?.url,
            audioUrl: jamendoTrack?.audio || null,
            duration: jamendoTrack?.duration || track.duration_ms / 1000,
            album: track.album.name,
            releaseDate: track.album.release_date,
            genre: jamendoTrack?.genre || null,
            spotifyId: track.id,
          };
        }),
    );
    return playlist;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
};

export const fetchLyrics = async (trackId) => {
  return "Lyrics are not available through the Jamendo API.";
};

export const getTrackInfo = async (trackId) => {
  try {
    const [spotifyTrack, jamendoTrack] = await Promise.all([
      fetchFromSpotify(`/tracks/${trackId}`),
      fetchFromJamendo("/tracks/", { id: trackId }),
    ]);

    const track = jamendoTrack.results[0] || spotifyTrack;

    if (track.audio) {
      preloadAudio(track.audio);
    }

    return {
      id: track.id,
      title: track.name,
      artist: track.artist_name || spotifyTrack.artists[0].name,
      album: track.album_name || spotifyTrack.album.name,
      albumCover: spotifyTrack.album.images[1]?.url || track.image,
      duration: track.duration || spotifyTrack.duration_ms / 1000,
      audioUrl: track.audio || null,
      releaseDate: track.releasedate || spotifyTrack.album.release_date,
      genre: track.genre || null,
      spotifyId: spotifyTrack.id,
    };
  } catch (error) {
    console.error("Error getting track info:", error);
    return null;
  }
};
