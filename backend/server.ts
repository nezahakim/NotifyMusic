import { Elysia, t } from "elysia";
import axios from "axios";
import { spawn } from "bun";
import { existsSync, chmodSync } from "fs";
import { cors } from '@elysiajs/cors'
import { Console } from "console";

const app = new Elysia().use(cors());

const YT_DLP_PATH = "./yt-dlp";

// 🔥 Automatically download yt-dlp if not present
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

// 🎵 Stream YouTube Audio (Direct to User)
// app.get("/stream", async ({ query, set }) => {
//   await downloadYtDlp(); // Ensure yt-dlp is ready
//   console.log(query.videoId)

// try{
//   if (!query.videoId) return { error: "Video ID is required" };
//   const url = `https://www.youtube.com/watch?v=${query.videoId}`;

//   // Bun.spawn to stream audio
//   const process = spawn([YT_DLP_PATH, "-f", "bestaudio", "-o", "-", "--no-playlist", url], {
//     stdout: "pipe",
//     stderr: "ignore",
//   });  

//   set.headers["Content-Type"] = "audio/mpeg"; 
//   set.status = 200;
//   set.headers["Transfer-Encoding"] = "chunked";
//   set.headers["Connection"] = "keep-alive";

//   return process.stdout; // Stream output directly

// } catch(error){
//   console.log(query.videoId)
//   console.log(error)
// }
// });

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


const activeRooms = new Map()

function cleanAudio(audioData: Uint8Array): Uint8Array {
  return audioData;
}

app.ws('/audio-stream/:roomId', {
  open(ws) {
    const roomId = ws.data?.params?.roomId;
    if (!roomId) return;
    
    // Create or join room
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }
    
    activeRooms.get(roomId).add(ws);

    ws.send({user: `User joined: ${roomId}`});
    console.log(`Client joined room: ${roomId}`);
  },
  
  message(ws, message) {
    const roomId = ws.data?.params?.roomId;
    if (!roomId) return;
    
    const room = activeRooms.get(roomId);
    if (!room) return;
    
    // Process audio data if it's a binary message
    if (message instanceof Uint8Array) {
      // Clean the audio
      const cleanedAudio = cleanAudio(message);
      
      // Broadcast to all clients in the room except sender
      room.forEach((client: any) => {
        if (client !== ws && client.readyState === 1) {
          client.send(cleanedAudio);
        }
      });
    }
  },
  
  close(ws) {
    const roomId = ws.data?.params?.roomId;
    if (!roomId) return;
    
    const room = activeRooms.get(roomId);
    if (room) {
      room.delete(ws);
      
      // If room is empty, clean up
      if (room.size === 0) {
        activeRooms.delete(roomId);
        console.log(`Room cleaned up: ${roomId}`);
      }
    }
  },
})

app.listen(3001, () => console.log("Server running on port 3001"));