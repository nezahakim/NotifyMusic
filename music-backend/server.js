const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const port = process.env.PORT || 3000;

// Ensure the 'downloads' directory exists
const downloadsDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

app.use(express.json());

app.get("/extract-audio/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const outputPath = path.join(downloadsDir, `${videoId}.mp3`);

  try {
    // Check if the file already exists
    if (fs.existsSync(outputPath)) {
      return res.json({ audioUrl: `/download/${videoId}.mp3` });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const videoInfo = await ytdl.getInfo(videoUrl);
    const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, "");

    await new Promise((resolve, reject) => {
      ytdl(videoUrl, { quality: "highestaudio" }).pipe(
        ffmpeg()
          .audioBitrate(128)
          .toFormat("mp3")
          .save(outputPath)
          .on("end", resolve)
          .on("error", reject),
      );
    });

    res.json({ audioUrl: `/download/${videoId}.mp3`, title });
  } catch (error) {
    console.error("Error extracting audio:", error);
    res.status(500).json({ error: "Failed to extract audio" });
  }
});

app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(downloadsDir, filename);
  res.download(filePath);
});

app.post("/share-telegram", async (req, res) => {
  const { audioUrl, chatId, botToken } = req.body;

  if (!audioUrl || !chatId || !botToken) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const audioFilePath = path.join(
      __dirname,
      "downloads",
      path.basename(audioUrl),
    );

    const formData = new FormData();
    formData.append("audio", fs.createReadStream(audioFilePath));
    formData.append("chat_id", chatId);

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendAudio`,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    res.json({ success: true, message: "Audio shared on Telegram" });
  } catch (error) {
    console.error("Error sharing audio on Telegram:", error);
    res.status(500).json({ error: "Failed to share audio on Telegram" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
