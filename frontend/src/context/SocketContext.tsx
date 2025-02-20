// "use client"

// import { createContext, useCallback,useContext, useEffect, useRef, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { API_BASE } from '@/lib/endpoints';
// import { Track } from '@/lib/types';

// interface RoomState {
//     participants: number;
//     currentTrack: Track | null;
//     isPlaying: boolean;
//     currentTime: number;
//     lastUpdateTime: number;
// }

// interface SocketContextType {
//     socket: Socket | null;
//     currentRoom: string | null;
//     roomState: RoomState | null;
//     isConnected: boolean;
//     joinRoom: (roomId: string) => Promise<{ success: boolean; error?: string }>;
//     leaveRoom: () => void;
//     reconnect: () => void;
// }

// // const defaultRoomState: RoomState = {
// //     participants: 0,
// //     currentTrack: null,
// //     isPlaying: false,
// //     currentTime: 0,
// //     lastUpdateTime: Date.now()
// // };


// const SocketContext = createContext<SocketContextType>({
//     socket: null,
//     currentRoom: null,
//     roomState: null,
//     isConnected: false,
//     joinRoom: async () => ({ success: false }),
//     leaveRoom: () => {},
//     reconnect: () => {}
// });

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//     const socketRef = useRef<Socket | null>(null);
//     const [currentRoom, setCurrentRoom] = useState<string | null>(null);
//     const [roomState, setRoomState] = useState<RoomState | null>(null);
//     const [isConnected, setIsConnected] = useState(false);

//     const joinRoom = async (roomId: string): Promise<{ success: boolean; error?: string }> => {
//         return new Promise((resolve) => {
//             if (!socketRef.current || !isConnected) {
//                 resolve({ success: false, error: 'Socket not connected' });
//                 return;
//             }

//             socketRef.current.emit('join-room', roomId, (response: { 
//                 success: boolean; 
//                 error?: string;
//                 state?: RoomState;
//             }) => {
//                 if (response.success && response.state) {
//                     setCurrentRoom(roomId);
//                     setRoomState(response.state);
//                     resolve({ success: true });
//                 } else {
//                     resolve({ success: false, error: response.error || 'Failed to join room' });
//                 }
//             });
//         });
//     };

//     const leaveRoom = () => {
//         if (socketRef.current && currentRoom) {
//             socketRef.current.emit('leave-room', currentRoom);
//             setCurrentRoom(null);
//             setRoomState(null);
//         }
//     };

//     const initializeSocket = useCallback(()=>{
//         socketRef.current = io(API_BASE, {
//             transports: ['websocket'],
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//             reconnectionDelayMax: 5000,
//             timeout: 20000,
//             autoConnect: true
//         });

//         socketRef.current.on('connect', () => {
//             setIsConnected(true);
//             console.log('Socket connected:', socketRef.current?.id);
            
//             if (currentRoom) {
//                 joinRoom(currentRoom);
//             }
//         });

//         socketRef.current.on('disconnect', () => {
//             setIsConnected(false);
//             console.log('Socket disconnected');
//         });

//         // Handle room state updates
//         socketRef.current.on('room-state', (state: RoomState) => {
//             setRoomState(state);
//         });

//         // Handle playback state updates
//         socketRef.current.on('playback-update', (update: Partial<RoomState>) => {
//             setRoomState(prev => prev ? { ...prev, ...update } : null);
//         });

//         socketRef.current.on('error', (error: string) => {
//             console.error('Socket error:', error);
//         });
//     },[joinRoom, currentRoom,setRoomState])

//     useEffect(() => {   
//         initializeSocket();

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//                 socketRef.current = null;
//                 setIsConnected(false);
//                 setCurrentRoom(null);
//                 setRoomState(null);
//             }
//         };
//     },[]);


//     const reconnect = () => {

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//         }
//         initializeSocket();
//     };

//     return (
//         <SocketContext.Provider value={{
//             socket: socketRef.current,
//             currentRoom,
//             roomState,
//             isConnected,
//             joinRoom,
//             leaveRoom,
//             reconnect
//         }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSocket = () => {
//     const context = useContext(SocketContext);
//     if (context === undefined) {
//         throw new Error('useSocket must be used within a SocketProvider');
//     }
//     return context;
// };

"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
    const hasInitialized = useRef(false);

    // Handle room state updates
    const handleRoomState = useCallback((state: RoomState) => {
        setRoomState(state);
    }, []);

    // Handle playback updates
    const handlePlaybackUpdate = useCallback((update: Partial<RoomState>) => {
        setRoomState(prev => prev ? { ...prev, ...update } : null);
    }, []);

    const joinRoom = useCallback(async (roomId: string): Promise<{ success: boolean; error?: string }> => {
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
    }, [isConnected]);

    const leaveRoom = useCallback(() => {
        if (socketRef.current && currentRoom) {
            socketRef.current.emit('leave-room', currentRoom);
            setCurrentRoom(null);
            setRoomState(null);
        }
    }, [currentRoom]);

    // Initialize socket only once
    useEffect(() => {
        if (hasInitialized.current || !API_BASE) return;
        
        hasInitialized.current = true;
        
        if (!socketRef.current) {
            socketRef.current = io(API_BASE, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                autoConnect: true
            });
        }

        const socket = socketRef.current;

        // Set up event listeners
        const handleConnect = () => {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);
            
            // Only attempt to join room if there is a currentRoom
            if (currentRoom) {
                // socket.emit('join-room', currentRoom);
            }
        };

        const handleDisconnect = () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        };

        const handleError = (error: string) => {
            console.error('Socket error:', error);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('room-state', handleRoomState);
        socket.on('playback-update', handlePlaybackUpdate);
        socket.on('error', handleError);

        // Cleanup function
        return () => {
            if (socket) {
                socket.off('connect', handleConnect);
                socket.off('disconnect', handleDisconnect);
                socket.off('room-state', handleRoomState);
                socket.off('playback-update', handlePlaybackUpdate);
                socket.off('error', handleError);
                
                // Don't disconnect on cleanup - let the socket handle its own lifecycle
                // socket.disconnect();
            }
        };
    }, [currentRoom, handleRoomState, handlePlaybackUpdate]);

    const reconnect = useCallback(() => {
        if (socketRef.current) {
            // Instead of creating a new connection, just reconnect the existing one
            socketRef.current.connect();
        }
    }, []);

    const contextValue = {
        socket: socketRef.current,
        currentRoom,
        roomState,
        isConnected,
        joinRoom,
        leaveRoom,
        reconnect
    };

    return (
        <SocketContext.Provider value={contextValue}>
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