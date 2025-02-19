"use client"
import Image from "next/image";
import Header from '@/components/Header';
import MenuTabs from '@/components/Tabs';
import { useAudioPlayer } from "@/context/AudioContext";
import { useSocket } from "@/context/SocketContext";
import { useEffect } from "react";

export default function RootLayout({
    children,}: Readonly<{
        children: React.ReactNode;
}>){

const player = useAudioPlayer();
const {joinRoom} = useSocket()

useEffect(()=>{
    const fetch = async () =>{
        const result = await joinRoom('roomId-123');
        return result;
      }
      fetch()
})

// Ensure `player?.currentTrack` exists before accessing `thumbnail`
const backgroundImage = player?.currentTrack?.thumbnail ? (
    <Image 
        className="fixed -inset-0 -z-50 blur-xl opacity-40" 
        src={player.currentTrack.thumbnail} 
        alt="cover" 
        layout="fill" 
        objectFit="cover"
        priority
    />
) : null;

return ( 
    <div className="h-screen flex flex-col">
        {/* Header - Fixed Height */}
        <Header />
        
        {/* Main Content - Flexible Height */}
        <main className="flex-1 min-h-0">
            {children}
        </main>
        
        {/* Footer - Fixed Height */}
        <footer className="backdrop-blur-xl">
            <MenuTabs />
        </footer>
        
        {/* Background Image */}
        {backgroundImage}
    </div>
);
}
