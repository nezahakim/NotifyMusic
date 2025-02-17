import { Elysia, t } from "elysia";
import axios from "axios";
import { spawn } from "bun";
import { existsSync, chmodSync } from "fs";
import { cors } from '@elysiajs/cors'
import { Server } from 'socket.io';

const app = new Elysia().use(cors());

const YT_DLP_PATH = "./yt-dlp";
const downloadYtDlp = async () => {
  if (!existsSync(YT_DLP_PATH)) {
    console.log("Downloading yt-dlp...");
    const response = await axios.get(
      "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp",
      { responseType: "arraybuffer" }
    );
    await Bun.write(YT_DLP_PATH, response.data);
    chmodSync(YT_DLP_PATH, 0o755); // Make it executable
    console.log("yt-dlp downloaded!");
  }
};

app.get("/search", async ({ query }) => {
  if (!query.q) return { error: "Query is required" };

  try {
    const searchQuery = encodeURIComponent(query.q + " audio");
    const response = await fetch(`https://www.youtube.com/results?search_query=${searchQuery}`);
    const html = await response.text();
    
    // Extract video data from the initial data object
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

    return videos;
  } catch (error) {
    console.log('Search error:', error);
    return { error: "Search failed" };
  }
});

app.get("/stream", async ({ query, set }) => {
  await downloadYtDlp();
  console.log(query.videoId)

  const url = `https://www.youtube.com/watch?v=${query.videoId}`;
  
  const process = spawn([
    YT_DLP_PATH,
    "-f", "bestaudio",
    "--extract-audio",
    "--audio-format", "mp3", // Force MP3 format
    "--audio-quality", "192K", // Set quality
    "-o", "-",
    "--no-playlist",
    url
  ], {
    stdout: "pipe",
    stderr: "ignore",
  });

  // Set correct headers for MP3 streaming
  set.headers["Content-Type"] = "audio/mpeg";
  set.headers["Accept-Ranges"] = "bytes";
  set.headers["Cache-Control"] = "no-cache";
  
  return process.stdout;
});


const activeRooms = new Map();

function cleanAudio(audioData: Uint8Array): Uint8Array {
  return audioData;
}


const io = new Server(3002, {
  cors: {
    origin: ["http://localhost:3000","http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Explicitly specify transports
});

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


app.listen(3001, () => {
  console.log(`🚀 Backend running on http://localhost:3001`);
});