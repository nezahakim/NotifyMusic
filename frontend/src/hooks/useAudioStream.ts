import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface AudioStreamOptions {
  roomId: string;
  serverUrl: string;
  onParticipantUpdate?: (count: number) => void;
  onChatMessage?: (msg:{user: string, message: string,avatar: string,isHost:boolean}) => void;
}

export function useAudioStream({
  roomId,
  serverUrl,
  onParticipantUpdate,
  onChatMessage
}: AudioStreamOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  // Initialize Socket.IO connection
  useEffect(() => {
    // Initialize socket connection with explicit configuration
    const socket = io(serverUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
      setIsConnected(true);
      setError(null);
      
      // Join the room
      socket.emit('join-room', roomId, (response:{success: boolean, participants: number}) => {
        if (response && response.success) {
          if (onParticipantUpdate) {
            onParticipantUpdate(response.participants);
          }
        } else if (response && !response.success) {
          setError(`Failed to join room: ${response.error}`);
        }
      });
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setIsConnected(false);
      setError(`Disconnected: ${reason}`);
    });
    
    socket.on('connect_error', (err) => {
      console.error("Socket.IO connection error:", err);
      setError(`Connection error: ${err.message}`);
    });
    
    socket.on('connect_timeout', () => {
      setError("Connection timeout");
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt: ${attemptNumber}`);
    });
    
    socket.on('reconnect_failed', () => {
      setError("Failed to reconnect");
    });
    
    socket.on('info', (data) => {
      if (data.participants !== undefined && onParticipantUpdate) {
        onParticipantUpdate(data.participants);
      }
    });
    
    socket.on('chat-message', (data) => {
      if (onChatMessage) {
        onChatMessage(data);
      }
    });
    
    socket.on('audio-data', (data) => {
      if (isMuted) return;
      
      try {
        const audioData = new Int16Array(data);
        if (audioContextRef.current) {
          const floatData = new Float32Array(audioData.length);
          
          // Convert Int16 to Float32 (-1.0 to 1.0)
          for (let i = 0; i < audioData.length; i++) {
            floatData[i] = audioData[i] / 32767;
          }
          
          // Create audio buffer
          const audioBuffer = audioContextRef.current.createBuffer(1, floatData.length, audioContextRef.current.sampleRate);
          audioBuffer.getChannelData(0).set(floatData);
          
          // Play the audio
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start();

          console.log(source)
        }
      } catch (err) {
        console.error("Error processing audio data:", err);
      }
    });
    
    socketRef.current = socket;
    
    // Initialize AudioContext
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as Window).webkitAudioContext)();
      } catch (err) {
        console.error("Error creating AudioContext:", err);
        setError("Could not initialize audio system");
      }
    }
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
      }
      stopMicrophone();
    };
  }, [isMuted,onChatMessage,roomId,onParticipantUpdate,serverUrl]);
  
  // Toggle mute state
  const toggleMute = async () => {
    if (isMuted) {
      try {
        await startMicrophone();
        setIsMuted(false);
      } catch (err) {
        setError("Could not access microphone");
        console.error("Microphone error:", err);
      }
    } else {
      stopMicrophone();
      setIsMuted(true);
    }
  };
  
  const startMicrophone = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as Window).webkitAudioContext)();
      }
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
  
      // **Load Audio Worklet**
      await audioContextRef.current.audioWorklet.addModule("/audioWorkletProcessor.js");
  
      // **Create AudioWorkletNode**
      const workletNode = new AudioWorkletNode(audioContextRef.current, "audio-processor");
  
      workletNode.port.onmessage = (event) => {
        if (socketRef.current && socketRef.current.connected) {
          try {
            const floatData = event.data;
            const intData = new Int16Array(floatData.length);
  
            for (let i = 0; i < floatData.length; i++) {
              intData[i] = floatData[i] * 32767;
            }
  
            socketRef.current.emit("audio-data", intData.buffer);
          } catch (err) {
            console.error("Error processing microphone data:", err);
          }
        }
      };
  
      source.connect(workletNode);
      workletNode.connect(audioContextRef.current.destination);
  
    } catch (err) {
      console.error("Error accessing microphone:", err);
      throw err;
    }
  };
  

  // Stop sending microphone audio
  const stopMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
  };
  
  // Send a chat message
  const sendChatMessage = (message: string, userName: string, isHost: boolean, avatar: string) => {
    if (socketRef.current && socketRef.current.connected) {
      const chatMessage = {
        type: 'chat',
        user: userName,
        message,
        avatar,
        isHost,
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.emit('chat-message', chatMessage);
    } else {
      setError("Cannot send message: not connected");
    }
  };
  
  return {
    isConnected,
    isMuted,
    error,
    toggleMute,
    sendChatMessage
  };
}
