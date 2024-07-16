"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Album, Track } from "../../../types";
import { getNewReleases, searchTracks } from "../../../lib/api";
import TrackList from "../../../components/TrackList";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchAlbumAndTracks = async () => {
      const albums = await getNewReleases();
      const foundAlbum = albums.find((a) => a.id === id);
      if (foundAlbum) {
        setAlbum(foundAlbum);
        const albumTracks = await searchTracks(foundAlbum.name);
        setTracks(albumTracks);
      }
    };
    fetchAlbumAndTracks();
  }, [id]);

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-6">
        <img
          src={album.images[0].url}
          alt={album.name}
          className="w-48 h-48 object-cover rounded-lg shadow-lg"
        />
        <div>
          <h1 className="text-4xl font-bold text-primary-light dark:text-white">
            {album.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {album.artists[0].name}
          </p>
        </div>
      </div>
      <TrackList tracks={tracks} onTrackSelect={() => {}} />
    </div>
  );
}
