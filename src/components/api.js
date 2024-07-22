// api.js
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();
const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";
const JAMENDO_CLIENT_ID = "e1372904"; // Replace with your actual Jamendo Client ID

export const getSpotifyAccessToken = async () => {
  const clientId = "44e86430da7d4bd7ae36d59f81aff51e";
  const clientSecret = "52dc1ffae8724a98a73dd92b1123074f";
  try {
    const result = await axios.post(
      "https://accounts.spotify.com/api/token",
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return result.data.access_token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
};

export const fetchSpotifyPlaylist = async (playlistId) => {
  try {
    const playlist = await spotifyApi.getPlaylist(playlistId);
    return playlist.tracks.items.map((item) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      albumCover: item.track.album.images[0].url,
    }));
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error);
    throw error;
  }
};

export const fetchJamendoTrack = async (trackName, artistName) => {
  try {
    const response = await axios.get(`${JAMENDO_API_BASE}/tracks`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: "json",
        limit: 1,
        name: trackName,
        artist_name: artistName,
      },
    });

    console.log(response.data);

    if (response.data.results.length > 0) {
      const track = response.data.results[0];
      return {
        audioUrl: track.audio,
        streamUrl: track.audiodownload,
      };
    } else {
      console.log("No track found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Jamendo track:", error);
    throw error;
  }
};

export const fetchLyrics = async (trackName, artistName) => {
  // Implement lyrics fetching logic here
  // This is a placeholder function
  return `Lyrics for ${trackName} by ${artistName}\n\nPlaceholder lyrics...`;
};
