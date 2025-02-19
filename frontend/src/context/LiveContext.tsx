"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAudioStream } from '@/hooks/useAudioStream';

interface Message {
  id: number;
  user: string;
  message: string;
  avatar: string;
  isHost: boolean;
}

interface LiveContextType {
  participantCount: number;
  isConnected: boolean;
  messages: Message[];
  unreadCount: number;
  sendMessage: (message: string, user: string, isHost: boolean, avatar: string) => void;
  resetUnreadCount: () => void;
  currentUser: {
    name: string;
    isHost: boolean;
    avatar: string;
  };
  isMuted: boolean;
  toggleMute: () => void;
}

const LiveContext = createContext<LiveContextType>({
  participantCount: 0,
  isConnected: false,
  messages: [],
  unreadCount: 0,
  sendMessage: () => {},
  resetUnreadCount: () => {},
  currentUser: {
    name: "",
    isHost: false,
    avatar: ""
  },
  isMuted: false,
  toggleMute: () => {}
});

export const LiveProvider = ({ children }: { children: ReactNode }) => {
  const [participantCount, setParticipantCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentUser = {
    name: "Sarah James", // This could come from your auth system
    isHost: true,
    avatar: "/cover.jpeg"
  };

  const {
    isConnected,
    isMuted,
    toggleMute,
    sendChatMessage
  } = useAudioStream({
    onParticipantUpdate: (count) => {
      setParticipantCount(count);
    },
    onChatMessage: (msg) => {
      const newMessage = {
        id: Date.now(),
        user: msg.user,
        message: msg.message,
        avatar: msg.avatar,
        isHost: msg.isHost
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Only increment unread count if message is from someone else
      if (msg.user !== currentUser.name) {
        setUnreadCount(prev => prev + 1);
      }
    }
  });

  const sendMessage = (message: string, user: string, isHost: boolean, avatar: string) => {
    sendChatMessage(message, user, isHost, avatar);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  return (
    <LiveContext.Provider 
      value={{
        participantCount,
        isConnected,
        messages,
        unreadCount,
        sendMessage,
        resetUnreadCount,
        currentUser,
        isMuted,
        toggleMute
      }}
    >
      {children}
    </LiveContext.Provider>
  );
};

export const useLive = () => useContext(LiveContext);