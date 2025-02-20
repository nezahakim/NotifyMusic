import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';

interface AudioStreamOptions {
  onParticipantUpdate?: (count: number) => void;
  onChatMessage?: (msg: {
    user: string;
    message: string;
    avatar: string;
    isHost: boolean;
  }) => void;
}

export function useAudioStream({
  onParticipantUpdate,
  onChatMessage,
}: AudioStreamOptions) {
  const { socket, isConnected, currentRoom,roomState } = useSocket();
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (!socket) return;
    
    if(currentRoom && roomState){
      if (roomState.participants !== undefined && onParticipantUpdate) {
        onParticipantUpdate(roomState.participants);
      }
    }

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

          for (let i = 0; i < audioData.length; i++) {
            floatData[i] = audioData[i] / 32767;
          }

          const audioBuffer = audioContextRef.current.createBuffer(
            1,
            floatData.length,
            audioContextRef.current.sampleRate
          );
          audioBuffer.getChannelData(0).set(floatData);

          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start();
        }
      } catch (err) {
        console.error('Error processing audio data:', err);
      }
    });

    // Initialize AudioContext
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (err) {
        console.error('Error creating AudioContext:', err);
        setError('Could not initialize audio system');
      }
    }

    socket.on('get-live-participants', (roomId, responce)=>{
      console.log(responce)
    });

    return () => {
      stopMicrophone();
    };
  }, [isMuted, onChatMessage, onParticipantUpdate, socket]);

  const startMicrophone = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as Window).webkitAudioContext)();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);

      await audioContextRef.current.audioWorklet.addModule(
        '/audioWorkletProcessor.js'
      );

      const workletNode = new AudioWorkletNode(
        audioContextRef.current,
        'audio-processor'
      );

      workletNode.port.onmessage = (event) => {
        if (socket && isConnected) {
          try {
            const floatData = event.data;
            const intData = new Int16Array(floatData.length);

            for (let i = 0; i < floatData.length; i++) {
              intData[i] = floatData[i] * 32767;
            }

            socket.emit('audio-data', intData.buffer);
          } catch (err) {
            console.error('Error processing microphone data:', err);
          }
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContextRef.current.destination);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      throw err;
    }
  };

  const toggleMute = async () => {
    if (isMuted) {
      try {
        await startMicrophone();
        setIsMuted(false);
      } catch (err) {
        setError('Could not access microphone');
        console.error('Microphone error:', err);
      }
    } else {
      stopMicrophone();
      setIsMuted(true);
    }
  };

  const stopMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current && audioContextRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
  };

  const sendChatMessage = (
    message: string,
    userName: string,
    isHost: boolean,
    avatar: string
  ) => {
    if (socket && isConnected) {
      const chatMessage = {
        type: 'chat',
        user: userName,
        message,
        avatar,
        isHost,
        timestamp: new Date().toISOString(),
      };

      socket.emit('chat-message', chatMessage);
    } else {
      setError('Cannot send message: not connected');
    }
  };

  return {
    isConnected,
    isMuted,
    error,
    toggleMute,
    sendChatMessage,
  };
}