import Link from "next/link";
import Image from "next/image";
import { Album } from "../types";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/album/${album.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
        <div className="relative h-48">
          <Image
            src={album.images[0].url}
            alt={album.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-1">
            {album.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-1">
            {album.artists[0].name}
          </p>
        </div>
      </div>
    </Link>
  );
}
