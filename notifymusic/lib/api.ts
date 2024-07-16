import { Album, Track } from "../types";

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = process.env.NEXT_PUBLIC_SPOTIFY_API_TOKEN;

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from Spotify API');
  }

  return await res.json();
}

export const getNewReleases = async (): Promise<Album[]> => {
  const response = await fetchWebApi('v1/browse/new-releases', 'GET');
  return response.albums.items;
};

export const getTopTracks = async (): Promise<Track[]> => {
  const response = await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=5', 'GET');
  return response.items;
};
