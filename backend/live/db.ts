import { Database } from 'bun:sqlite';

// Define interfaces for our models
interface User {
  id?: number;
  name: string;
  avatar: string;
  createdAt?: string;
}

interface Room {
  id?: number;
  name: string;
  hostId: number;
  createdAt?: string;
}

interface Message {
  id?: number;
  roomId: number;
  userId: number;
  content: string;
  isHost: boolean;
  createdAt?: string;
}

interface Participant {
  id?: number;
  roomId: number;
  userId: number;
  role: string;
  isMuted: boolean;
  joinedAt?: string;
}

export class DBManager {
  private db: Database;

  constructor() {
    this.db = new Database('audio_rooms.sqlite');
    this.initDatabase();
  }

  private initDatabase() {
    // Create users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create rooms table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        host_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (host_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create messages table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_host BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create participants table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        is_muted BOOLEAN DEFAULT true,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
  }

  // User methods
  createUser(name: string, avatar: string): User {
    const stmt = this.db.prepare(`
      INSERT INTO users (name, avatar) VALUES (?, ?)
    `);
    const result = stmt.run(name, avatar);
    return {
      id: result.lastInsertRowid as number,
      name,
      avatar,
      createdAt: new Date().toISOString()
    };
  }

  getUser(id: number): User | null {
    const user = this.db.query<User>(`
      SELECT id, name, avatar, created_at as createdAt FROM users WHERE id = ?
    `).get(id);
    return user || null;
  }

  getUserByName(name: string): User | null {
    const user = this.db.query<User>(`
      SELECT id, name, avatar, created_at as createdAt FROM users WHERE name = ?
    `).get(name);
    return user || null;
  }

  // Room methods
  createRoom(name: string, hostId: number): Room {
    const stmt = this.db.prepare(`
      INSERT INTO rooms (name, host_id) VALUES (?, ?)
    `);
    const result = stmt.run(name, hostId);
    return {
      id: result.lastInsertRowid as number,
      name,
      hostId,
      createdAt: new Date().toISOString()
    };
  }

  getRoom(id: number): Room | null {
    const room = this.db.query<Room>(`
      SELECT id, name, host_id as hostId, created_at as createdAt FROM rooms WHERE id = ?
    `).get(id);
    return room || null;
  }

  getRoomByName(name: string): Room | null {
    const room = this.db.query<Room>(`
      SELECT id, name, host_id as hostId, created_at as createdAt FROM rooms WHERE name = ?
    `).get(name);
    return room || null;
  }

  // Message methods
  createMessage(roomId: number, userId: number, content: string, isHost: boolean): Message {
    const stmt = this.db.prepare(`
      INSERT INTO messages (room_id, user_id, content, is_host) VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(roomId, userId, content, isHost ? 1 : 0);
    return {
      id: result.lastInsertRowid as number,
      roomId,
      userId,
      content,
      isHost,
      createdAt: new Date().toISOString()
    };
  }

  getRecentMessages(roomId: number, limit: number = 20): Message[] {
    return this.db.query<Message>(`
      SELECT 
        id, 
        room_id as roomId, 
        user_id as userId, 
        content, 
        is_host as isHost, 
        created_at as createdAt 
      FROM messages 
      WHERE room_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(roomId, limit);
  }

  // Participant methods
  addParticipant(roomId: number, userId: number, role: string, isMuted: boolean = true): Participant {
    const stmt = this.db.prepare(`
      INSERT INTO participants (room_id, user_id, role, is_muted) VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(roomId, userId, role, isMuted ? 1 : 0);
    return {
      id: result.lastInsertRowid as number,
      roomId,
      userId,
      role,
      isMuted,
      joinedAt: new Date().toISOString()
    };
  }

  removeParticipant(roomId: number, userId: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM participants WHERE room_id = ? AND user_id = ?
    `);
    const result = stmt.run(roomId, userId);
    return result.changes > 0;
  }

  getParticipants(roomId: number): Participant[] {
    return this.db.query<Participant>(`
      SELECT 
        id, 
        room_id as roomId, 
        user_id as userId, 
        role, 
        is_muted as isMuted, 
        joined_at as joinedAt 
      FROM participants 
      WHERE room_id = ?
    `).all(roomId);
  }

  getParticipantCount(roomId: number): number {
    const result = this.db.query<{ count: number }>(`
      SELECT COUNT(*) as count FROM participants WHERE room_id = ?
    `).get(roomId);
    return result?.count || 0;
  }

  updateParticipantMuteStatus(roomId: number, userId: number, isMuted: boolean): boolean {
    const stmt = this.db.prepare(`
      UPDATE participants SET is_muted = ? WHERE room_id = ? AND user_id = ?
    `);
    const result = stmt.run(isMuted ? 1 : 0, roomId, userId);
    return result.changes > 0;
  }

  // Get full participant info including user details
  getParticipantsWithUserInfo(roomId: number): any[] {
    return this.db.query(`
      SELECT 
        p.id,
        p.room_id as roomId,
        p.user_id as userId,
        p.role,
        p.is_muted as isMuted,
        p.joined_at as joinedAt,
        u.name,
        u.avatar,
        (p.user_id = r.host_id) as isHost
      FROM participants p
      JOIN users u ON p.user_id = u.id
      JOIN rooms r ON p.room_id = r.id
      WHERE p.room_id = ?
    `).all(roomId);
  }
}

// Singleton pattern to ensure we only have one DB connection
let instance: DBManager | null = null;

export function getDBManager(): DBManager {
  if (!instance) {
    instance = new DBManager();
  }
  return instance;
}