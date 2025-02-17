import { Database } from "bun:sqlite";
import { mkdir, existsSync } from "fs";
import path from "path";

// Ensure storage directories exist
const STORAGE_DIR = "./storage";
const CACHE_DIR = path.join(STORAGE_DIR, "cache");
const DB_PATH = path.join(STORAGE_DIR, "streaming.db");

if (!existsSync(STORAGE_DIR)) {
  mkdir(STORAGE_DIR, { recursive: true }, (err) => {
    if (err) console.error("Error creating storage directory:", err);
  });
}

if (!existsSync(CACHE_DIR)) {
  mkdir(CACHE_DIR, { recursive: true }, (err) => {
    if (err) console.error("Error creating cache directory:", err);
  });
}

// Initialize database
const db = new Database(DB_PATH);

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS streams (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    viewer_count INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    stream_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stream_id) REFERENCES streams(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS cached_songs (
    id TEXT PRIMARY KEY,
    youtube_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    artist TEXT,
    duration INTEGER,
    cache_path TEXT NOT NULL,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 1,
    file_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Database management class
export class StreamingDB {
  private db: Database;
  private cacheSizeLimit: number; // in bytes (default 1GB)

  constructor(cacheSizeLimit = 1024 * 1024 * 1024) {
    this.db = db;
    this.cacheSizeLimit = cacheSizeLimit;
  }

  // User Management
  async createUser(id: string, username: string) {
    return this.db.run(
      "INSERT INTO users (id, username) VALUES (?, ?)",
      [id, username]
    );
  }

  async getUser(id: string) {
    return this.db.query("SELECT * FROM users WHERE id = ?").get(id);
  }

  async updateUserLastSeen(id: string) {
    return this.db.run(
      "UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );
  }

  // Stream Management
  async createStream(id: string, userId: string, title: string, description: string) {
    return this.db.run(
      "INSERT INTO streams (id, user_id, title, description) VALUES (?, ?, ?, ?)",
      [id, userId, title, description]
    );
  }

  async endStream(id: string) {
    return this.db.run(
      "UPDATE streams SET ended_at = CURRENT_TIMESTAMP, is_live = false WHERE id = ?",
      [id]
    );
  }

  async updateStreamViewerCount(id: string, count: number) {
    return this.db.run(
      "UPDATE streams SET viewer_count = ? WHERE id = ?",
      [count, id]
    );
  }

  async getLiveStreams() {
    return this.db.query(`
      SELECT s.*, u.username
      FROM streams s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_live = true
      ORDER BY s.started_at DESC
    `).all();
  }

  // Chat Management
  async addChatMessage(id: string, streamId: string, userId: string, content: string) {
    return this.db.run(
      "INSERT INTO chat_messages (id, stream_id, user_id, content) VALUES (?, ?, ?, ?)",
      [id, streamId, userId, content]
    );
  }

  async getStreamChat(streamId: string, limit = 100) {
    return this.db.query(`
      SELECT cm.*, u.username
      FROM chat_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.stream_id = ?
      ORDER BY cm.created_at DESC
      LIMIT ?
    `).all(streamId, limit);
  }

  // Song Caching
  async addCachedSong(
    id: string,
    youtubeId: string,
    title: string,
    artist: string | null,
    duration: number,
    cachePath: string,
    fileSize: number
  ) {
    await this.manageCache(fileSize);
    return this.db.run(`
      INSERT INTO cached_songs 
      (id, youtube_id, title, artist, duration, cache_path, file_size)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, youtubeId, title, artist, duration, cachePath, fileSize]);
  }

  async getCachedSong(youtubeId: string) {
    const song = this.db.query(`
      SELECT * FROM cached_songs WHERE youtube_id = ?
    `).get(youtubeId);

    if (song) {
      // Update access count and timestamp
      this.db.run(`
        UPDATE cached_songs 
        SET access_count = access_count + 1,
            last_accessed = CURRENT_TIMESTAMP
        WHERE youtube_id = ?
      `, [youtubeId]);
    }

    return song;
  }

  private async manageCache(newFileSize: number) {
    // Get current cache size
    const result = this.db.query(`
      SELECT SUM(file_size) as total_size FROM cached_songs
    `).get();
    const currentSize = result.total_size || 0;

    // If adding new file would exceed limit, remove least accessed files
    if (currentSize + newFileSize > this.cacheSizeLimit) {
      const filesToRemove = this.db.query(`
        SELECT id, cache_path, file_size
        FROM cached_songs
        ORDER BY access_count ASC, last_accessed ASC
      `).all();

      let freedSpace = 0;
      for (const file of filesToRemove) {
        if (currentSize + newFileSize - freedSpace <= this.cacheSizeLimit) {
          break;
        }
        // Remove file from filesystem
        try {
          await Bun.file(file.cache_path).remove();
          // Remove from database
          this.db.run("DELETE FROM cached_songs WHERE id = ?", [file.id]);
          freedSpace += file.file_size;
        } catch (error) {
          console.error(`Error removing cached file: ${error}`);
        }
      }
    }
  }

  // Cleanup methods
  async cleanup() {
    // Remove ended streams older than 7 days
    this.db.run(`
      DELETE FROM streams
      WHERE is_live = false 
      AND ended_at < datetime('now', '-7 days')
    `);

    // Remove chat messages from deleted streams
    this.db.run(`
      DELETE FROM chat_messages
      WHERE stream_id NOT IN (SELECT id FROM streams)
    `);

    // Remove cached songs not accessed in 30 days
    const oldCachedSongs = this.db.query(`
      SELECT cache_path FROM cached_songs
      WHERE last_accessed < datetime('now', '-30 days')
    `).all();

    for (const song of oldCachedSongs) {
      try {
        await Bun.file(song.cache_path).remove();
      } catch (error) {
        console.error(`Error removing old cached file: ${error}`);
      }
    }

    this.db.run(`
      DELETE FROM cached_songs
      WHERE last_accessed < datetime('now', '-30 days')
    `);
  }
}