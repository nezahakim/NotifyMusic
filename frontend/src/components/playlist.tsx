import { useEffect, useState } from 'react';
import { Filter } from "@/lib/icons";
import Image from "next/image";
import { useAudioPlayer } from '@/context/AudioContext';
import { Track } from '@/lib/types';



const PlayList = ({onClose}: {onClose: ()=> void}) => {
  const [isVisible, setIsVisible] = useState(true);
  const player = useAudioPlayer()

  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(()=>{
    setTracks(player.queue)
  },[player])

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
      onClose()
    }
  };

  return (
    <div 
      onClick={handleOutsideClick} 
      className={`fixed w-full h-full top-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className={`absolute bottom-0 z-10 bg-white w-full h-[60%] rounded-t-3xl p-6 shadow-2xl transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Queue</h1>
          <div className="flex items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <Filter width={20} height={20} className="mr-2" />
            <span className="text-sm font-semibold">Filter</span>
          </div>
        </div>

        {/* Tracks List */}
        {tracks.length <= 0 ?'No queued songs!':''}
        <div className="overflow-y-auto h-[calc(100%-5rem)] pb-20">
          {tracks.map((track, id) => (
            <div
              key={id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 mb-2"
            >
              <Image
                src={track.thumbnail}
                alt={track.title}
                width={56}
                height={56}
                className="rounded-xl shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium truncate">{track.title}</p>
                <p className="text-sm text-gray-500 truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayList;
