import Image from 'next/image';
import { PlayIcon } from '@heroicons/react/24/solid';

interface TrackCardProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
  };
  onPlay: () => void;
}

export default function TrackCard({ track, onPlay }: TrackCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
      <div className="relative h-48">
        <Image 
          src={track.album.images[0]?.url || '/placeholder.png'} 
          alt={track.name} 
          layout="fill" 
          objectFit="cover"
        />
        <button 
          onClick={onPlay}
          className="absolute bottom-2 right-2 bg-primary-light text-white p-2 rounded-full hover:bg-primary-dark"
        >
          <PlayIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white truncate">{track.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 truncate">{track.artists.map(a => a.name).join(', ')}</p>
      </div>
    </div>
  );
}