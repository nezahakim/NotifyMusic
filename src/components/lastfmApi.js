const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const JAMENDO_CLIENT_ID = "e1372904";
const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";
let spotifyToken = "";

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
  const response = await fetch(
    `${SPOTIFY_BASE_URL}${endpoint}?${queryParams}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return await response.json();
};

const fetchFromJamendo = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    ...params,
  });
  const response = await fetch(`${JAMENDO_BASE_URL}${endpoint}?${queryParams}`);
  return await response.json();
};

const preloadAudio = (url) => {
  const audio = new Audio();
  audio.preload = "auto";
  audio.src = url;
};

export const fetchPlaylist = async () => {
  try {
    const [spotifyNewReleases, jamendoTracks] = await Promise.all([
      fetchFromSpotify("/browse/new-releases", { limit: 20 }),
      fetchFromJamendo("/tracks/", { limit: 20, order: "popularity_total" }),
    ]);

    const playlist = await Promise.all(
      spotifyNewReleases.albums.items.map(async (album, index) => {
        const jamendoTrack = jamendoTracks.results[index];
        if (jamendoTrack) preloadAudio(jamendoTrack.audio);

        return {
          id: jamendoTrack?.id || album.id,
          title: album.name,
          artist: album.artists[0].name,
          albumCover: album.images[1]?.url,
          audioUrl: jamendoTrack?.audio || null,
          duration: jamendoTrack?.duration || 0,
          album: album.name,
          releaseDate: album.release_date,
          genre: jamendoTrack?.genre || null,
          spotifyId: album.id,
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
    if (track.audio) preloadAudio(track.audio);

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
