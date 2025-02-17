// src/api/streaming.ts
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export class StreamingClient {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  // Stream Management
  async startStream(userId: string, title: string, description: string) {
    const { data } = await axios.post(`${API_BASE}/streams/start`, {
      userId,
      title,
      description
    });
    return data;
  }

  async endStream(streamId: string, userId: string) {
    const { data } = await axios.post(`${API_BASE}/streams/end`, {
      streamId,
      userId
    });
    return data;
  }

  // WebSocket Connection
  connectToStream(streamId: string, handlers: {
    onChat?: (message: any) => void;
    onViewerCount?: (count: number) => void;
    onReaction?: (reaction: any) => void;
    onStreamEnd?: () => void;
  }) {
    this.ws = new WebSocket(`ws://localhost:3001/ws/stream/${streamId}`);

    this.ws.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);
      
      switch (eventType) {
        case 'chat':
          handlers.onChat?.(data);
          break;
        case 'viewerCount':
          handlers.onViewerCount?.(data.count);
          break;
        case 'reaction':
          handlers.onReaction?.(data);
          break;
        case 'streamEnded':
          handlers.onStreamEnd?.();
          break;
      }
    };

    return () => {
      this.ws?.close();
      this.ws = null;
    };
  }

  // Chat and Interactions
  sendChatMessage(streamId: string, message: {
    userId: string;
    username: string;
    content: string;
  }) {
    this.ws?.send(JSON.stringify({
      type: 'chat',
      data: message
    }));
  }

  sendReaction(streamId: string, reaction: {
    userId: string;
    type: string;
  }) {
    this.ws?.send(JSON.stringify({
      type: 'reaction',
      data: reaction
    }));
  }

  // Discovery
  async getLiveStreams() {
    const { data } = await axios.get(`${API_BASE}/streams/live`);
    return data;
  }

  async getStreamDetails(streamId: string) {
    const { data } = await axios.get(`${API_BASE}/streams/${streamId}`);
    return data;
  }

  // User Management
  async createUser(username: string) {
    const { data } = await axios.post(`${API_BASE}/users`, { username });
    return data;
  }

  // YouTube Integration
  async searchYouTube(query: string) {
    const { data } = await axios.get(`${API_BASE}/youtube/search`, {
      params: { q: query }
    });
    return data;
  }

  getAudioStreamUrl(videoId: string) {
    return `${API_BASE}/stream/${videoId}`;
  }
}

export const streamingClient = new StreamingClient();