import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Explicitly specify transports
});

const activeRooms = new Map();

function cleanAudio(audioData: Uint8Array): Uint8Array {
  return audioData;
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  let currentRoom:any = null;

  // Handle joining a room
  socket.on('join-room', (roomId, callback) => {
    try {
      // Leave current room if any
      if (currentRoom) {
        socket.leave(currentRoom);
        const room = activeRooms.get(currentRoom);
        if (room) {
          room.delete(socket.id);
          if (room.size === 0) {
            activeRooms.delete(currentRoom);
            console.log(`Room cleaned up: ${currentRoom}`);
          }
        }
      }

      // Join new room
      socket.join(roomId);
      currentRoom = roomId;
      
      // Create room if it doesn't exist
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, new Set());
      }
      
      activeRooms.get(roomId).add(socket.id);
      console.log(`Client ${socket.id} joined room: ${roomId}`);
      
      // Send current participant count
      const participantCount = activeRooms.get(roomId).size;
      io.to(roomId).emit('info', { 
        type: 'info',
        participants: participantCount
      });
      
      if (callback) callback({ success: true, participants: participantCount });
    } catch (err:any) {
      console.error("Error in join-room:", err);
      if (callback) callback({ success: false, error: err.message });
    }
  });
  
  // Handle audio data
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
    if(roomId && activeRooms.has(roomId)){
      const participantCount = activeRooms.get(roomId).size;    
    if (callback) callback({ success: true, participants: participantCount });
    }
  })
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected:`, reason);
    if (currentRoom) {
      const room = activeRooms.get(currentRoom);
      if (room) {
        room.delete(socket.id);
        
        // If room is empty, clean up
        if (room.size === 0) {
          activeRooms.delete(currentRoom);
          console.log(`Room cleaned up: ${currentRoom}`);
        } else {
          // Send updated participant count
          io.to(currentRoom).emit('info', { 
            type: 'info',
            participants: room.size
          });
        }
      }
    }
  });
});
