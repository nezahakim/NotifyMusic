const LASTFM_API_KEY = "dc2ef552b5a4d0391955cdb0806676bd";
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";
const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

let spotifyToken = "";

const fetchFromLastFm = async (method, params) => {
  const queryParams = new URLSearchParams({
    method,
    api_key: LASTFM_API_KEY,
    format: "json",
    ...params,
  });
  const response = await fetch(`${LASTFM_BASE_URL}?${queryParams}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

const getSpotifyToken = async () => {
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
};

const fetchFromSpotify = async (endpoint, params = {}) => {
  if (!spotifyToken) {
    await getSpotifyToken();
  }
  const queryParams = new URLSearchParams(params);
  const response = await fetch(
    `${SPOTIFY_BASE_URL}${endpoint}?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const fetchPlaylist = async () => {
  try {
    const lastfmData = await fetchFromLastFm("chart.gettoptracks", {
      limit: 20,
    });
    const playlist = await Promise.all(
      lastfmData.tracks.track.map(async (track) => {
        const spotifyData = await fetchFromSpotify("/search", {
          q: `track:${track.name} artist:${track.artist.name}`,
          type: "track",
          limit: 1,
        });
        const spotifyTrack = spotifyData.tracks.items[0];
        return {
          id: spotifyTrack?.id || `${track.name}-${track.artist.name}`,
          title: track.name,
          artist: track.artist.name,
          albumCover:
            spotifyTrack?.album.images[1]?.url || track.image[2]["#text"],
          audioUrl: spotifyTrack?.preview_url || "",
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
  // Spotify doesn't provide lyrics, so we'll return a placeholder message
  return "Lyrics are not available through the Spotify API.";
};

export const getTrackInfo = async (trackId) => {
  try {
    const spotifyData = await fetchFromSpotify(`/tracks/${trackId}`);
    return {
      id: spotifyData.id,
      title: spotifyData.name,
      artist: spotifyData.artists[0].name,
      album: spotifyData.album.name,
      albumCover: spotifyData.album.images[1]?.url || "",
      duration: spotifyData.duration_ms / 1000, // Convert to seconds
      audioUrl: spotifyData.preview_url || "",
    };
  } catch (error) {
    console.error("Error getting track info:", error);
    return null;
  }
};