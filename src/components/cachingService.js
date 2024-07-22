// cachingService.js
const CACHE_NAME = "music-player-cache-v1";

export const cacheTrack = async (track) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(track.audioUrl);
  await cache.put(track.audioUrl, response);
};

export const getCachedTrack = async (audioUrl) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(audioUrl);
  return response ? response.blob() : null;
};

export const prefetchNextTracks = async (tracks, currentIndex) => {
  const nextTracks = tracks.slice(currentIndex + 1, currentIndex + 4);
  for (const track of nextTracks) {
    if (track.audioUrl) {
      const cachedTrack = await getCachedTrack(track.audioUrl);
      if (!cachedTrack) {
        cacheTrack(track);
      }
    }
  }
};
