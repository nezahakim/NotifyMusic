// spotifyApi.js

import axios from "axios";

const CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";

let accessToken = null;
let tokenExpirationTime = 0;

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    console.log("New access token obtained:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchFromSpotify = async (endpoint, params = {}) => {
  try {
    const token = await getAccessToken();
    const url = new URL(`https://api.spotify.com/v1${endpoint}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]),
    );

    const response = await axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = parseInt(error.response.headers["retry-after"] || "1");
      console.log(`Rate limited. Retrying after ${retryAfter} seconds.`);
      await delay(retryAfter * 1000);
      return fetchFromSpotify(endpoint, params);
    }
    console.error(`Error fetching from Spotify (${endpoint}):`, error);
    throw error;
  }
};

export const fetchPlaylist = async () => {
  try {
    const playlistId = "37i9dQZEVXbMDoHDwVN2tF"; // Global Top 50 playlist
    const data = await fetchFromSpotify(`/playlists/${playlistId}`);
    console.log("Playlist data:", data);

    return data.tracks.items.map((item) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      albumCover: item.track.album.images[0].url,
      audioUrl: item.track.preview_url,
    }));
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
};

export const fetchLyrics = async (trackId) => {
  return "Lyrics are not available through the Spotify API.";
};

export const searchTracks = async (query) => {
  try {
    const data = await fetchFromSpotify("/search", {
      q: query,
      type: "track",
      limit: 10,
    });
    return data.tracks.items.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      albumCover: track.album.images[1].url,
      audioUrl: track.preview_url,
    }));
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
};

export const getTrackInfo = async (trackId) => {
  try {
    const track = await fetchFromSpotify(`/tracks/${trackId}`);
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      albumCover: track.album.images[1].url,
      duration: track.duration_ms / 1000,
      audioUrl: track.preview_url,
    };
  } catch (error) {
    console.error("Error getting track info:", error);
    return null;
  }
};

export const fetchQueue = async () => {
  try {
    const playlist = await fetchPlaylist();
    return playlist.slice(1, 11);
  } catch (error) {
    console.error("Error fetching queue:", error);
    return [];
  }
};
