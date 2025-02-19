"use client"

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE } from '@/lib/endpoints';
import { Track } from '@/lib/types';

interface RoomState {
    participants: number;
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    lastUpdateTime: number;
}

interface SocketContextType {
    socket: Socket | null;
    currentRoom: string | null;
    roomState: RoomState | null;
    isConnected: boolean;
    joinRoom: (roomId: string) => Promise<{ success: boolean; error?: string }>;
    leaveRoom: () => void;
    reconnect: () => void;
}

const defaultRoomState: RoomState = {
    participants: 0,
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    lastUpdateTime: Date.now()
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    currentRoom: null,
    roomState: null,
    isConnected: false,
    joinRoom: async () => ({ success: false }),
    leaveRoom: () => {},
    reconnect: () => {}
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const initializeSocket = () => {
        socketRef.current = io(API_BASE, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected:', socketRef.current?.id);
            
            if (currentRoom) {
                joinRoom(currentRoom);
            }
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        // Handle room state updates
        socketRef.current.on('room-state', (state: RoomState) => {
            setRoomState(state);
        });

        // Handle playback state updates
        socketRef.current.on('playback-update', (update: Partial<RoomState>) => {
            setRoomState(prev => prev ? { ...prev, ...update } : null);
        });

        socketRef.current.on('error', (error: any) => {
            console.error('Socket error:', error);
        });
    };

    useEffect(() => {
        initializeSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
                setCurrentRoom(null);
                setRoomState(null);
            }
        };
    }, []);

    const joinRoom = async (roomId: string): Promise<{ success: boolean; error?: string }> => {
        return new Promise((resolve) => {
            if (!socketRef.current || !isConnected) {
                resolve({ success: false, error: 'Socket not connected' });
                return;
            }

            socketRef.current.emit('join-room', roomId, (response: { 
                success: boolean; 
                error?: string;
                state?: RoomState;
            }) => {
                if (response.success && response.state) {
                    setCurrentRoom(roomId);
                    setRoomState(response.state);
                    resolve({ success: true });
                } else {
                    resolve({ success: false, error: response.error || 'Failed to join room' });
                }
            });
        });
    };

    const leaveRoom = () => {
        if (socketRef.current && currentRoom) {
            socketRef.current.emit('leave-room', currentRoom);
            setCurrentRoom(null);
            setRoomState(null);
        }
    };

    const reconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        initializeSocket();
    };

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            currentRoom,
            roomState,
            isConnected,
            joinRoom,
            leaveRoom,
            reconnect
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};