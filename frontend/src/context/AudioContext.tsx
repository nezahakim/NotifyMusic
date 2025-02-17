"use client";

import React, { createContext, useContext } from 'react';
// Import your existing custom hooks
import { useAudioPlayerHook } from '@/hooks/useAudioPlayer';
import { useSearchHook } from '@/hooks/useSearch';

interface ContextFace {
  player: ReturnType<typeof useAudioPlayerHook>;
  search: ReturnType<typeof useSearchHook>;
}


const AudioContext = createContext<ContextFace | undefined>(undefined);

// Create Provider Component that uses your existing hooks
export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize your existing hooks
  const audioPlayer = useAudioPlayerHook();
  const search = useSearchHook();

  // Combine them into a single value to provide through context
  const value = {
    player: audioPlayer,
    search: search
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// Export hooks that use the context
export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context.player;
};

export const useSearch = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within an AudioProvider');
  }
  return context.search;
};