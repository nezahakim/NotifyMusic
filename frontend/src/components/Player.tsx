"use client"
import {
  Shuffle, Play, Telegram, Share, Heart, Repeat,
  SkipPrevious, SkipNext, Pause,
  Playlist
} from "@/lib/icons";
import Image from "next/image";

import { useAudioPlayer } from "@/context/AudioContext";
import { useState } from "react";
import PlayList from "./playlist";

const PlayerHeader = () => (
  <div className="w-full px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
          <span className="text-xs font-medium bg-white text-gray-900 px-4 py-1.5 rounded-full shadow-sm">
              Song
          </span>
          <span className="text-xs font-medium text-gray-600 px-4 py-1.5">
              Lyrics
          </span>
      </div>
      <button className="p-1.5 rounded-full hover:bg-gray-100 transition-all">
          <Telegram className="w-5 h-5 text-gray-600" />
      </button>
  </div>
);

const Controls = ({ player, onPlaylistClick }: {player: ({isPlaying: boolean, currentTime:number, duration: number, actions: {playNext: ()=>void,togglePlay:()=>void, playPrevious:()=>void, seek: (e: number)=>void }}); onPlaylistClick:()=>void}) => {
    const { isPlaying, currentTime, duration, actions } = player;
    
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    
    return (
      <div className="w-full px-4">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
              <Share className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={onPlaylistClick} className="p-2 rounded-full hover:bg-gray-100 transition-all">
              <Playlist className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">{formatTime(currentTime)}</span>
          <span className="text-xs font-medium text-gray-500">{formatTime(duration)}</span>
        </div>
        <div 
          className="relative w-full h-1 bg-gray-200 rounded-full mb-4 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            actions.seek(percent * duration);
          }}
        >
          <div 
            className="absolute left-0 top-0 h-full bg-gray-900 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
  
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
            <Shuffle className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-6">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
              onClick={actions.playPrevious}
            >
              <SkipPrevious className="w-6 h-6 text-gray-900" />
            </button>
            <button 
              className="p-3 bg-gray-900 rounded-full hover:bg-gray-800 transition-all"
              onClick={actions.togglePlay}
            >
              {isPlaying ? 
                <Pause className="w-6 h-6 text-white" /> :
                <Play className="w-6 h-6 text-white" />
              }
            </button>
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
              onClick={actions.playNext}
            >
              <SkipNext className="w-6 h-6 text-gray-900" />
            </button>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
            <Repeat className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
};

const Player = () => {

    const player = useAudioPlayer();
    const [showPlaylist, setShowPlaylist] = useState(false);

  return (
      <div className="h-full flex flex-col py-2">
          <PlayerHeader />
          
          {/* Album Art and Title */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
          {player.currentTrack ? (
            <>
              <div className="relative w-48 h-48 mb-6">
                  <Image
                      className="rounded-2xl object-cover shadow-xl"
                      src={player.currentTrack.thumbnail}
                      alt="Album Cover"
                      layout="fill"
                  />
              </div>
              <h1 className="text-xl font-semibold text-center mb-2 text-gray-900 px-4">
                  {player.currentTrack.title}
              </h1>
              <span className="text-base text-gray-600">{player.currentTrack.artist}</span>
              </>
              ): (
                <p className="text-gray-500">Search for music to start playing</p>
              )}
          </div>

          {/* Controls Section */}
          <div className="py-4">
              <Controls player={player} onPlaylistClick={()=>setShowPlaylist(true)} />
          </div>

          {/* PLAYLIST */}
          {showPlaylist && <PlayList onClose={() => setShowPlaylist(false)} />}
      
      </div>
  );
};

export default Player