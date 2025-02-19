"use client"
import Image from "next/image";
import Player from '@/components/Player';
import Header from '@/components/Header';
import MenuTabs from '@/components/Tabs';
import { useAudioPlayer } from "@/context/AudioContext";
import { Entry } from "@/components/Entry";



const Home = () => {

const player = useAudioPlayer();

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

    return (<Entry/>);
};

export default Home;