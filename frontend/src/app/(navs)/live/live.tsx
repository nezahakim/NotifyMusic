"use client"

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Message, People, Heart, Mic, VolumeUp, Share } from "@/utils/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudioStream } from '@/hooks/useAudioStream';

const Live = () => {
  const [message, setMessage] = useState('');
  const [participantCount, setParticipantCount] = useState(3);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alex", message: "That guitar riff was amazing! 🎸", avatar: "/cover.jpeg", isHost: false },
    { id: 2, user: "Sarah James", message: "Thanks! Taking requests now", avatar: "/cover.jpeg", isHost: true },
    { id: 3, user: "Maria", message: "Can you play your new single?", avatar: "/cover.jpeg", isHost: false }
  ]);

  // Hardcoded room info for this example
  const roomId = "acoustic-night-1";

  const currentUser = {
    name: "Sarah James",
    isHost: true,
    avatar: "/cover.jpeg"
  };

  const [roomParticipants, setRoomParticipants] = useState( [
    {
      id: 1,
      name: "Sarah James",
      role: "Host",
      avatar: "/cover.jpeg",
      isSpeaking: true,
      isHost: true,
      isMuted: false
    },
    {
      id: 2,
      name: "John Doe",
      role: "Co-Host",
      avatar: "/cover.jpeg",
      isSpeaking: false,
      isHost: false,
      isMuted: false
    },
    {
      id: 3,
      name: "Alice Smith",
      role: "Listener",
      avatar: "/cover.jpeg",
      isSpeaking: false,
      isHost: false,
      isMuted: true
    }
  ])
  // Initialize the audio streaming hook
  const {
    isConnected,
    isMuted,
    error,
    toggleMute,
    sendChatMessage
  } = useAudioStream({
    roomId,
    serverUrl: "http://localhost:3001",
    onParticipantUpdate: (count) => {
      setParticipantCount(count);
    },
    onChatMessage: (msg) => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          user: msg.user,
          message: msg.message,
          avatar: msg.avatar,
          isHost: msg.isHost
        }
      ]);
    }
  });

  // Example modification in useAudioStream hook initialization


  // Handle sending a chat message
  const handleSendMessage = () => {
    if (message.trim()) {
      sendChatMessage(
        message,
        currentUser.name,
        currentUser.isHost,
        currentUser.avatar
      );
      setMessage('');
    }
  };

  return (
    <div className="h-full flex">
      {/* Participants List */}
      <div className="w-full md:w-2/3 h-full overflow-y-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Acoustic Night
            </h1>
            <p className="text-sm text-gray-600">
              Hosted by Sarah James
              {isConnected ? 
                <span className="ml-2 text-green-500 text-xs">• Live</span> : 
                <span className="ml-2 text-red-500 text-xs">• Offline</span>
              }
            </p>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roomParticipants.map((participant) => (
            <div
              key={participant.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <Image
                    src={participant.avatar}
                    width={80}
                    height={80}
                    alt={participant.name}
                    className="rounded-full"
                  />
                  {participant.isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800">{participant.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    participant.isHost ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {participant.role}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {participant.name === currentUser.name ? (
                    <Button 
                      size="sm" 
                      variant={isMuted ? "ghost" : "default"}
                      onClick={toggleMute}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant={participant.isMuted ? "ghost" : "default"}>
                      <Mic className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <VolumeUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat Section */}
      <div className="hidden md:flex md:w-1/3 h-full border-l border-gray-200 flex-col bg-white/60 backdrop-blur-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Live Chat</h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <Image
                  src={msg.avatar}
                  width={32}
                  height={32}
                  alt={msg.user}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {msg.user}
                    {msg.isHost && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                        Host
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Send a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>
              <Message className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live;
