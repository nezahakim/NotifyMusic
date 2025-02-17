import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors';
import axios from "axios";
import { spawn } from "bun";
import { existsSync, chmodSync } from "fs";
import { randomUUID } from "crypto";
import { StreamingDB } from "./database";
import path from "path";

const app = new Elysia().use(cors());
const db = new StreamingDB();
const YT_DLP_PATH = "./yt-dlp";
const API_KEY = process.env.YOUTUBE_API_KEY;

// Initialize stream connections map
const streamConnections = new Map<string, Set<any>>();

app
  .post("/users", async ({ body }) => {
    const { username } = body as any;
    const userId = randomUUID();
    await db.createUser(userId, username);
    return { id: userId, username };
  })

  .post("/streams/start", async ({ body }) => {
    const { userId, title, description } = body as any;
    const streamId = randomUUID();
    
    try {
      await db.createStream(streamId, userId, title, description);
      return { streamId };
    } catch (error) {
      return { error: "Failed to create stream" };
    }
  })

  .post("/streams/end", async ({ body }) => {
    const { streamId } = body as any;
    await db.endStream(streamId);
    return { success: true };
  })

  .get("/streams/live", async () => {
    return await db.getLiveStreams();
  })

  .get("/youtube/search", async ({ query }) => {
    if (!query.q) return { error: "Query is required" };

    try {
      const { data } = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: API_KEY,
          q: query.q + " audio",
          part: "snippet",
          maxResults: 5,
          type: "video",
        },
      });

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url
      }));
    } catch (error) {
      return { error: "YouTube search failed" };
    }
  })

  .get("/stream/:videoId", async ({ params, set }) => {
    // Check cache first
    const cachedSong = await db.getCachedSong(params.videoId);
    
    if (cachedSong) {
      set.headers["Content-Type"] = "audio/mpeg";
      return Bun.file(cachedSong.cache_path);
    }

    // If not cached, download and cache
    await downloadYtDlp();
    const cachePath = path.join("storage", "cache", `${params.videoId}.mp3`);
    
    const url = `https://www.youtube.com/watch?v=${params.videoId}`;
    const process = spawn([
      YT_DLP_PATH,
      "-f", "bestaudio",
      "-o", cachePath,
      "--no-playlist",
      url
    ]);

    await process.completion;

    // Get file info and cache it
    const file = Bun.file(cachePath);
    const size = (await file.size);
    
    await db.addCachedSong(
      randomUUID(),
      params.videoId,
      "Unknown Title", // You might want to fetch this from YouTube API
      null,
      0, // Duration could be extracted using ffmpeg
      cachePath,
      size
    );

    set.headers["Content-Type"] = "audio/mpeg";
    return file;
  })

  .ws("/ws/stream/:streamId", {
    open(ws) {
      const streamId = ws.data.params.streamId;
      if (!streamConnections.has(streamId)) {
        streamConnections.set(streamId, new Set());
      }
      streamConnections.get(streamId)?.add(ws);
      
      // Update viewer count in database
      const viewers = streamConnections.get(streamId)?.size || 0;
      db.updateStreamViewerCount(streamId, viewers);
    },
    
    message(ws, message) {
      const { type, data } = JSON.parse(message as string);
      const streamId = ws.data.params.streamId;
      
      if (type === "chat") {
        const messageId = randomUUID();
        db.addChatMessage(messageId, streamId, data.userId, data.content);
        
        // Broadcast to all connected clients
        const connections = streamConnections.get(streamId);
        connections?.forEach(client => {
          client.send(JSON.stringify({
            type: "chat",
            data: {
              id: messageId,
              ...data,
              timestamp: new Date()
            }
          }));
        });
      }
    },
    
    close(ws) {
      const streamId = ws.data.params.streamId;
      streamConnections.get(streamId)?.delete(ws);
      
      // Update viewer count
      const viewers = streamConnections.get(streamId)?.size || 0;
      db.updateStreamViewerCount(streamId, viewers);
    }
  });

// Cleanup task - run every 24 hours
setInterval(() => {
  db.cleanup().catch(console.error);
}, 24 * 60 * 60 * 1000);

app.listen(3001, () => console.log("🚀 Streaming server running on port 3001"));