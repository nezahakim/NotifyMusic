import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AudioPlayer from "../components/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotifyMusic+",
  description: "Listen to your favorite music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AudioPlayer
          songTitle="Song Title"
          artistName="Artist Name"
          coverArt="./1.jpg"
        />
      </body>
    </html>
  );
}
