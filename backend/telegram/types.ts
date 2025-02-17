import { Context } from 'telegraf';

export interface Track {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export interface UserSession {
  currentTrack: Track | null;
  playlist: Track[];
  searchResults: Track[];
}

export interface BotContext extends Context {
  session: UserSession;
}
