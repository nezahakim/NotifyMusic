// cachingService.js
import { fetchYouTubeVideo } from "./api";

const CACHE_NAME = "music-player-cache";

export const cacheTrack = async (track) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(`track-${track.id}`, new Response(JSON.stringify(track)));
};

export const getCachedTrack = async (trackId) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`track-${trackId}`);
  if (response) {
    return response.json();
  }
  return null;
};

export const prefetchNextTracks = async (playlist, currentIndex) => {
  const nextTracks = playlist.slice(currentIndex + 1, currentIndex + 4);
  for (const track of nextTracks) {
    const cachedTrack = await getCachedTrack(track.id);
    if (!cachedTrack) {
      const youtubeVideo = await fetchYouTubeVideo(track.title, track.artist);
      if (youtubeVideo) {
        await cacheTrack({ ...track, ...youtubeVideo });
      }
    }
  }
};
