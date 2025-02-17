import { useState } from 'react';
import { Filter, Heart, Plus } from "@/utils/icons";
import Image from "next/image";

interface Track {
  id: number;
  title: string;
  artist: string;
  image: string;
  isLiked: boolean;
}

const PlayList = ({onClose}: {onClose: ()=> void}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, title: "Amazing Song 1", artist: "Artist 1", image: "/cover.jpeg", isLiked: false },
    { id: 2, title: "Beautiful Track 2", artist: "Artist 2", image: "/cover.jpeg", isLiked: false },
  ]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
      onClose()
    }
  };

  const toggleLike = (trackId: number) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, isLiked: !track.isLiked } : track
    ));
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
        <div className="overflow-y-auto h-[calc(100%-5rem)] pb-20">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 mb-2"
            >
              <Image
                src={track.image}
                alt={track.title}
                width={56}
                height={56}
                className="rounded-xl shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium truncate">{track.title}</p>
                <p className="text-sm text-gray-500 truncate">{track.artist}</p>
              </div>
              <button
                onClick={() => toggleLike(track.id)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${
                    track.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayList;
