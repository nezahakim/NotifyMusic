// cachingService.js
import { fetchYouTubeVideo } from "./api";

import { openDB } from "idb";

const DB_NAME = "MusicPlayerCache";
const STORE_NAME = "tracks";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export async function cacheTrack(track) {
  const db = await dbPromise;
  await db.put(STORE_NAME, track, track.id);
}

export async function getCachedTrack(trackId) {
  const db = await dbPromise;
  return db.get(STORE_NAME, trackId);
}

export async function prefetchNextTracks(tracks) {
  for (const track of tracks) {
    const cachedTrack = await getCachedTrack(track.id);
    if (!cachedTrack) {
      // Fetch and cache the track
      const youtubeVideo = await fetchYouTubeVideo(track.title, track.artist);
      const updatedTrack = { ...track, ...youtubeVideo };
      await cacheTrack(updatedTrack);
    }
  }
}
