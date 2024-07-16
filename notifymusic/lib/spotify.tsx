const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

async function fetchSpotifyApi(
  endpoint: string,
  method: string = "GET",
  body?: any,
) {
  const res = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.SPOTIFY_API_TOKEN}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

export async function searchTracks(query: string) {
  const data = await fetchSpotifyApi(
    `/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
  );
  return data.tracks?.items || [];
}

export async function getTopTracks() {
  const data = await fetchSpotifyApi(
    "/me/top/tracks?time_range=long_term&limit=5",
  );
  return data.items || [];
}
