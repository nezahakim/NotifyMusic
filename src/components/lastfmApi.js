// const LASTFM_API_KEY = "dc2ef552b5a4d0391955cdb0806676bd";
// const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";
// const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
// const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
// const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

// let spotifyToken = "";

// const fetchFromLastFm = async (method, params) => {
//   const queryParams = new URLSearchParams({
//     method,
//     api_key: LASTFM_API_KEY,
//     format: "json",
//     ...params,
//   });
//   const response = await fetch(`${LASTFM_BASE_URL}?${queryParams}`);
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return await response.json();
// };

// const getSpotifyToken = async () => {
//   const response = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
//     },
//     body: "grant_type=client_credentials",
//   });
//   const data = await response.json();
//   spotifyToken = data.access_token;
// };

// const fetchFromSpotify = async (endpoint, params = {}) => {
//   if (!spotifyToken) {
//     await getSpotifyToken();
//   }
//   const queryParams = new URLSearchParams(params);
//   const response = await fetch(
//     `${SPOTIFY_BASE_URL}${endpoint}?${queryParams}`,
//     {
//       headers: {
//         Authorization: `Bearer ${spotifyToken}`,
//       },
//     },
//   );
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return await response.json();
// };

// export const fetchPlaylist = async () => {
//   try {
//     const lastfmData = await fetchFromLastFm("chart.gettoptracks", {
//       limit: 20,
//     });
//     const playlist = await Promise.all(
//       lastfmData.tracks.track.map(async (track) => {
//         const spotifyData = await fetchFromSpotify("/search", {
//           q: `track:${track.name} artist:${track.artist.name}`,
//           type: "track",
//           limit: 1,
//         });
//         const spotifyTrack = spotifyData.tracks.items[0];
//         return {
//           id: spotifyTrack?.id || `${track.name}-${track.artist.name}`,
//           title: track.name,
//           artist: track.artist.name,
//           albumCover:
//             spotifyTrack?.album.images[1]?.url || track.image[2]["#text"],
//           audioUrl: spotifyTrack?.preview_url || "",
//         };
//       }),
//     );
//     return playlist;
//   } catch (error) {
//     console.error("Error fetching playlist:", error);
//     return [];
//   }
// };

// export const fetchLyrics = async (trackId) => {
//   // Spotify doesn't provide lyrics, so we'll return a placeholder message
//   return "Lyrics are not available through the Spotify API.";
// };

// export const getTrackInfo = async (trackId) => {
//   try {
//     const spotifyData = await fetchFromSpotify(`/tracks/${trackId}`);
//     return {
//       id: spotifyData.id,
//       title: spotifyData.name,
//       artist: spotifyData.artists[0].name,
//       album: spotifyData.album.name,
//       albumCover: spotifyData.album.images[1]?.url || "",
//       duration: spotifyData.duration_ms / 1000, // Convert to seconds
//       audioUrl: spotifyData.preview_url || "",
//     };
//   } catch (error) {
//     console.error("Error getting track info:", error);
//     return null;
//   }
// };

const SPOTIFY_CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
const SPOTIFY_CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const JAMENDO_CLIENT_ID = "e1372904";
const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";
let spotifyToken = "";

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

const fetchFromJamendo = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    ...params,
  });
  const response = await fetch(`${JAMENDO_BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

const findBestSpotifyMatch = (jamendoTrack, spotifyTracks) => {
  if (spotifyTracks.length === 0) return null;

  return spotifyTracks.reduce((best, current) => {
    const currentScore = calculateMatchScore(jamendoTrack, current);
    const bestScore = calculateMatchScore(jamendoTrack, best);
    return currentScore > bestScore ? current : best;
  });
};

const calculateMatchScore = (jamendoTrack, spotifyTrack) => {
  let score = 0;

  // Compare track names
  if (jamendoTrack.name.toLowerCase() === spotifyTrack.name.toLowerCase()) {
    score += 3;
  } else if (
    jamendoTrack.name.toLowerCase().includes(spotifyTrack.name.toLowerCase()) ||
    spotifyTrack.name.toLowerCase().includes(jamendoTrack.name.toLowerCase())
  ) {
    score += 2;
  }

  // Compare artist names
  if (
    jamendoTrack.artist_name.toLowerCase() ===
    spotifyTrack.artists[0].name.toLowerCase()
  ) {
    score += 3;
  } else if (
    jamendoTrack.artist_name
      .toLowerCase()
      .includes(spotifyTrack.artists[0].name.toLowerCase()) ||
    spotifyTrack.artists[0].name
      .toLowerCase()
      .includes(jamendoTrack.artist_name.toLowerCase())
  ) {
    score += 2;
  }

  // Compare durations (with 5-second tolerance)
  const durationDiff = Math.abs(
    jamendoTrack.duration - spotifyTrack.duration_ms / 1000,
  );
  if (durationDiff <= 5) {
    score += 2;
  }

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
          spotifyData.tracks.items,
        );

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

export const fetchLyrics = async (trackId) => {
  return "Lyrics are not available through the Jamendo API.";
};

export const getTrackInfo = async (trackId) => {
  try {
    const jamendoData = await fetchFromJamendo(`/tracks/`, { id: trackId });
    const jamendoTrack = jamendoData.results[0];

    const spotifyData = await fetchFromSpotify("/search", {
      q: `track:${jamendoTrack.name} artist:${jamendoTrack.artist_name}`,
      type: "track",
      limit: 5,
    });
    const bestSpotifyMatch = findBestSpotifyMatch(
      jamendoTrack,
      spotifyData.tracks.items,
    );

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
