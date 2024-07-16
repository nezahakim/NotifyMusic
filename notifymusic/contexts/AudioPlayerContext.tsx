"use client";

import React, { createContext, useState, useContext } from "react";
import { Track } from "../types";
import useAudioPlayer from "../hooks/useAudioPlayer";

interface AudioPlayerContextType {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  seek: (time: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const { isPlaying, duration, currentTime, togglePlay, seek } =
    useAudioPlayer();

  const value = {
    currentTrack,
    setCurrentTrack,
    isPlaying,
    duration,
    currentTime,
    togglePlay,
    seek,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayers = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider",
    );
  }
  return context;
};
