import { Server } from 'socket.io';
import { spawn } from 'bun';

interface RoomState {
    participants: Set<string>;
    currentTrack: any | null;
    isPlaying: boolean;
    currentTime: number;
    startTime: number;
    isStreaming: boolean;
}

const io = new Server(3001, {
    cors: {
        origin: "*",
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
    },
    transports: ['websocket', 'polling']
});

const activeRooms = new Map<string, RoomState>();
const YT_DLP_PATH = "./yt-dlp";

const broadcastRoomState = (roomId: string) => {
    const room = activeRooms.get(roomId);
    if (!room) return;

    io.to(roomId).emit('room-state', {
        participants: room.participants.size,
        currentTrack: room.currentTrack,
        isPlaying: room.isPlaying,
        currentTime: room.currentTime
    });
};

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    let currentRoom: string | null = null;

    socket.on('join-room', async (roomId, callback) => {
        try {
            if (currentRoom && currentRoom !== roomId) {
                socket.leave(currentRoom);
                const room = activeRooms.get(currentRoom);
                if (room) {
                    room.participants.delete(socket.id);
                    if (room.participants.size === 0) {
                        activeRooms.delete(currentRoom);
                    } else {
                        broadcastRoomState(currentRoom);
                    }
                }
            }

            await socket.join(roomId);
            currentRoom = roomId;

            if (!activeRooms.has(roomId)) {
                activeRooms.set(roomId, {
                    participants: new Set([socket.id]),
                    currentTrack: null,
                    isPlaying: false,
                    currentTime: 0,
                    startTime: Date.now(),
                    isStreaming: false
                });
            } else {
                const room = activeRooms.get(roomId)!;
                room.participants.add(socket.id);
                
                // If there's an active track, send it to the new participant
                if (room.currentTrack) {
                    socket.emit('current-track', {
                        track: room.currentTrack,
                        isPlaying: room.isPlaying,
                        currentTime: room.currentTime
                    });
                }
            }

            broadcastRoomState(roomId);
            
            callback({
                success: true,
                state: {
                    participants: activeRooms.get(roomId)!.participants.size,
                    currentTrack: activeRooms.get(roomId)!.currentTrack,
                    isPlaying: activeRooms.get(roomId)!.isPlaying,
                    currentTime: activeRooms.get(roomId)!.currentTime
                }
            });

        } catch (error: any) {
            console.error("Error joining room:", error);
            callback({ success: false, error: error.message });
        }
    });

    socket.on('stream', async ({ track, roomId }) => {
        const room = activeRooms.get(roomId);
        if (!room || room.isStreaming) return;

        room.isStreaming = true;
        room.currentTrack = track;
        room.startTime = Date.now();
        room.currentTime = 0;
        room.isPlaying = true;

        broadcastRoomState(roomId);

        const url = `https://www.youtube.com/watch?v=${track.videoId}`;
        
        io.to(roomId).emit('stream-start', { 
            startTime: room.startTime,
            track
        });
    
        try {
            const process = spawn([
                YT_DLP_PATH,
                "-f", "bestaudio",
                "--extract-audio",
                "--audio-format", "mp3",
                "--audio-quality", "192K",
                "-o", "-",
                "--no-playlist",
                url
            ]);
        
            if (process.stdout) {
                for await (const chunk of process.stdout) {
                    const currentRoom = activeRooms.get(roomId);
                    if (!currentRoom || currentRoom.currentTrack?.videoId !== track.videoId) {
                        process.kill();
                        break;
                    }

                    io.to(roomId).emit('audio-chunk', {
                        data: chunk,
                        track
                    });
                }
                
                const currentRoom = activeRooms.get(roomId);
                if (currentRoom && currentRoom.currentTrack?.videoId === track.videoId) {
                    currentRoom.isStreaming = false;
                    io.to(roomId).emit('stream-end', { 
                        videoId: track.videoId,
                        startTime: currentRoom.startTime
                    });
                }
            }
        } catch (error) {
            console.error('Streaming error:', error);
            const currentRoom = activeRooms.get(roomId);
            if (currentRoom) {
                currentRoom.isStreaming = false;
            }
            io.to(roomId).emit('stream-error', { 
                videoId: track.videoId,
                error: 'Failed to stream audio'
            });
        }
    });
    

    socket.on('playback-state', ({ isPlaying, currentTime, roomId }) => {
        const room = activeRooms.get(roomId);
        if (!room) return;

        room.isPlaying = isPlaying;
        room.currentTime = currentTime;

        socket.to(roomId).emit('playback-update', {
            isPlaying,
            currentTime
        });
    });

    socket.on('seek', ({ time, roomId }) => {
        const room = activeRooms.get(roomId);
        if (!room) return;

        room.currentTime = time;

        socket.to(roomId).emit('playback-update', {
            currentTime: time,
            isPlaying: room.isPlaying
        });
    });

    socket.on('playback-ended', ({ roomId }) => {
        const room = activeRooms.get(roomId);
        if (!room) return;

        room.isPlaying = false;
        room.currentTime = 0;

        broadcastRoomState(roomId);
    });


    socket.on('search', async ({ query }) => {
        console.log('searching...')
    
        if (!query) {
            socket.emit('search-error', { message: "Query is required" });
            return;
        }
    
        try {
            const searchQuery = encodeURIComponent(query + " audio");
            const response = await fetch(`https://www.youtube.com/results?search_query=${searchQuery}`);
            const html = await response.text();
            
            const match = html.match(/var ytInitialData = (.+?);<\/script>/);
            const data = JSON.parse(match[1]);
            
            const videos = data.contents.twoColumnSearchResultsRenderer
                .primaryContents.sectionListRenderer
                .contents[0].itemSectionRenderer
                .contents
                .filter((item: { videoRenderer: any; }) => item.videoRenderer)
                .map((item: { videoRenderer: any; }) => {
                    const video = item.videoRenderer;
                    return {
                        videoId: video.videoId,
                        title: video.title.runs[0].text,
                        artist: video.ownerText.runs[0].text,
                        thumbnail: `https://i.ytimg.com/vi/${video.videoId}/default.jpg`
                    };
                })
                .slice(0, 10);
    
            // Emit results only to the searching client
            socket.emit('search-results', {
                query,
                results: videos
            });
    
        } catch (error) {
            console.log('Search error:', error);
            socket.emit('search-error', { 
                message: "Search failed",
                query 
            });
        }
    });
    
    const cleanAudio = (data:any) =>{
        return data
    }
    
    socket.on('audio-data', (audioData) => {
        if (!currentRoom) return;
        
        try {
          // Clean the audio
          const cleanedAudio = cleanAudio(audioData);
          
          // Broadcast to all clients in the room except sender
          socket.to(currentRoom).emit('audio-data', cleanedAudio);
        } catch (err) {
          console.error("Error in audio-data:", err);
        }
      });
      
      // Handle chat messages
      socket.on('chat-message', (message) => {
        if (!currentRoom) return;
        
        try {
          // Broadcast chat message to all clients in the room including sender
          io.to(currentRoom).emit('chat-message', message);
        } catch (err) {
          console.error("Error in chat-message:", err);
        }
      });
    
      socket.on('get-live-participants', (roomId, callback)=>{
        // Send current participant count
        if(currentRoom){
            const room = activeRooms.get(currentRoom);
            if(room){
                if (callback) callback({
                    success: true,
                    participants: room.participants.size
                });
            }
        }
      })

    socket.on('disconnect', () => {
        if (currentRoom) {
            const room = activeRooms.get(currentRoom);
            if (room) {
                room.participants.delete(socket.id);
                if (room.participants.size === 0) {
                    activeRooms.delete(currentRoom);
                    console.log("Room cleaned up (disconnect):", currentRoom);
                } else {
                    broadcastRoomState(currentRoom);
                }
            }
        }
    });
});

console.log("Socket server running on port 3001");