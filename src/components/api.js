// api.js

import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = "AIzaSyD6dMrDgFbjiEbYV_RKdxY3RX1KAzzyisg"; // Replace with your actual YouTube API key

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

// export const fetchYouTubeVideo = async (trackName, artistName) => {
//   try {
//     const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
//       params: {
//         part: "snippet",
//         q: `${trackName} ${artistName} official audio`,
//         type: "video",
//         maxResults: 1,
//         key: YOUTUBE_API_KEY,
//       },
//     });

//     if (response.data.items.length > 0) {
//       const video = response.data.items[0];
//       return {
//         videoId: video.id.videoId,
//         title: video.snippet.title,
//         thumbnailUrl: video.snippet.thumbnails.default.url,
//       };
//     } else {
//       console.log("No video found");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching YouTube video:", error);
//     throw error;
//   }
// };

export const fetchYouTubeVideo = async (trackName, artistName) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: "snippet",
        q: `${trackName} ${artistName} official audio`,
        type: "video",
        maxResults: 5,
        key: YOUTUBE_API_KEY,
      },
    });

    if (response.data.items.length > 0) {
      // Filter results to find the best match
      const bestMatch =
        response.data.items.find(
          (video) =>
            video.snippet.title
              .toLowerCase()
              .includes(trackName.toLowerCase()) &&
            video.snippet.title
              .toLowerCase()
              .includes(artistName.toLowerCase()),
        ) || response.data.items[0];

      return {
        videoId: bestMatch.id.videoId,
        title: bestMatch.snippet.title,
        thumbnailUrl: bestMatch.snippet.thumbnails.default.url,
      };
    } else {
      console.log("No video found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    throw error;
  }
};

export const fetchLyrics = async (trackName, artistName) => {
  // Implement lyrics fetching logic here
  // This is a placeholder function
  return `Lyrics for ${trackName} by ${artistName}\n\nPlaceholder lyrics...`;
};
