import { WebSocketRouter } from 'your-framework'; // Adjust based on your actual framework

interface Participant {
    id: string;
    ws: WebSocket;
    name: string;
    isHost: boolean;
    avatar: string;
    isMuted: boolean;
  }
  
  interface Room {
    id: string;
    participants: Map<string, Participant>;
    host?: string; // ID of the host
  }
  
  // Store active rooms
  const activeRooms = new Map<string, Room>();
  
  // Generate random ID for users
  function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  // Clean audio processing function
  function cleanAudio(audioData: Uint8Array): Uint8Array {
    // You could implement noise reduction or other processing here
    return audioData;
  }
  
  // Function to broadcast room participant updates
  function broadcastParticipants(roomId: string) {
    const room = activeRooms.get(roomId);
    if (!room) return;
    
    const participantsList = Array.from(room.participants.values()).map(p => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      avatar: p.avatar,
      isMuted: p.isMuted
    }));
    
    const message = JSON.stringify({
      type: 'info',
      participants: participantsList,
      count: participantsList.length
    });
    
    room.participants.forEach(participant => {
      if (participant.ws.readyState === 1) {
        participant.ws.send(message);
      }
    });
  }
  
  app.ws('/audio-stream/:roomId', {
    open(ws) {
      const roomId = ws.data?.params?.roomId;
      if (!roomId) return;
      
      // Create unique ID for this participant
      const participantId = generateId();
      
      // Attach the ID to the websocket object for later reference
      ws.participantId = participantId;
      
      // Create or join room
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, {
          id: roomId,
          participants: new Map(),
        });
      }
      
      const room = activeRooms.get(roomId);
      
      // Add to participants with default values
      // These will be updated when user sends their info
      room.participants.set(participantId, {
        id: participantId,
        ws,
        name: `User-${participantId.substring(0, 4)}`,
        isHost: room.participants.size === 0, // First joiner is host
        avatar: "/default-avatar.jpg",
        isMuted: true
      });
      
      // If this is the first participant, make them the host
      if (room.participants.size === 1) {
        room.host = participantId;
      }
      
      console.log(`Client joined room: ${roomId} (ID: ${participantId})`);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        participantId,
        isHost: room.host === participantId
      }));
      
      // Broadcast updated participant list
      broadcastParticipants(roomId);
    },
    
    message(ws, message) {
      const roomId = ws.data?.params?.roomId;
      const participantId = ws.participantId;
      
      if (!roomId || !participantId) return;
      
      const room = activeRooms.get(roomId);
      if (!room) return;
      
      // Process audio data if it's a binary message
      if (message instanceof Uint8Array) {
        // Clean the audio
        const cleanedAudio = cleanAudio(message);
        
        // Get participant info
        const sender = room.participants.get(participantId);
        if (!sender || sender.isMuted) return;
        
        // Broadcast to all clients in the room except sender
        room.participants.forEach(participant => {
          if (participant.id !== participantId && participant.ws.readyState === 1) {
            participant.ws.send(cleanedAudio);
          }
        });
      }
      // Process JSON messages
      else if (typeof message === 'string') {
        try {
          const data = JSON.parse(message);
          
          if (data.type === 'userInfo') {
            // Update participant info
            const participant = room.participants.get(participantId);
            if (participant) {
              participant.name = data.name || participant.name;
              participant.avatar = data.avatar || participant.avatar;
              
              // Only update host status if they're already the host
              if (room.host === participantId) {
                participant.isHost = true;
              }
              
              // Broadcast updated participant list
              broadcastParticipants(roomId);
            }
          }
          else if (data.type === 'muteStatus') {
            // Update mute status
            const participant = room.participants.get(participantId);
            if (participant) {
              participant.isMuted = data.isMuted;
              
              // Broadcast updated participant list
              broadcastParticipants(roomId);
            }
          }
          else if (data.type === 'chat') {
            // Get the sender's info
            const sender = room.participants.get(participantId);
            if (!sender) return;
            
            // Create chat message with proper sender info
            const chatMessage = {
              type: 'chat',
              user: data.user || sender.name,
              message: data.message,
              avatar: data.avatar || sender.avatar,
              isHost: sender.isHost,
              timestamp: new Date().toISOString(),
              senderId: participantId
            };
            
            // Broadcast to everyone in the room
            room.participants.forEach(participant => {
              if (participant.ws.readyState === 1) {
                participant.ws.send(JSON.stringify(chatMessage));
              }
            });
          }
        } catch (e) {
          console.error('Error processing message:', e);
        }
      }
    },
    
    close(ws) {
      const roomId = ws.data?.params?.roomId;
      const participantId = ws.participantId;
      
      if (!roomId || !participantId) return;
      
      const room = activeRooms.get(roomId);
      if (room) {
        // Remove participant
        room.participants.delete(participantId);
        
        // If this was the host, assign a new host if possible
        if (room.host === participantId && room.participants.size > 0) {
          const newHost = room.participants.keys().next().value;
          room.host = newHost;
          
          const participant = room.participants.get(newHost);
          if (participant) {
            participant.isHost = true;
          }
        }
        
        // If room is empty, clean up
        if (room.participants.size === 0) {
          activeRooms.delete(roomId);
          console.log(`Room cleaned up: ${roomId}`);
        } else {
          // Broadcast updated participant list
          broadcastParticipants(roomId);
        }
      }
    },
  })