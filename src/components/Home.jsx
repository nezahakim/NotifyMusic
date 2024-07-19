import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { PlayIcon, PauseIcon, HeartIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch data from Spotify API
    const fetchData = async () => {
      try {
        const token = 'BQBdhpCgLZFYR4-oauUK2JKd8MVIshHAOTLFN4bM--ZvKqdnS9ZJzDd_p5rR_8YT8iYZyjAv3iQfNx8U0KwcpHeOglWO4E7Etzl5-hG9y7e3baRn6Ul0DbU291cGhwyTafsURLFtgpog_MCwgmPIGUolpdU5ZSeYeu6G7htSzWVPvIXa-zCiuiDfpUROMQBcVz3EV-OfkEapL5VyHL_9a9eo_56pyR2hOxBHjrAwK5YB3akxVSi-L29G9FCKwofjcDeaG3sweTjti2mtmHwpH32V';
        const headers = { Authorization: `Bearer ${token}` };

        const [playlistsRes, releasesRes, tracksRes, genresRes] = await Promise.all([
          axios.get('https://api.spotify.com/v1/browse/featured-playlists', { headers }),
          axios.get('https://api.spotify.com/v1/browse/new-releases', { headers }),
          axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks', { headers }),
          axios.get('https://api.spotify.com/v1/browse/categories', { headers }),
        ]);

        setFeaturedPlaylists(playlistsRes.data.playlists.items);
        setNewReleases(releasesRes.data.albums.items);
        setTopTracks(tracksRes.data.items.map(item => item.track));
        setGenres(genresRes.data.categories.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Your Music</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredPlaylists.slice(0, 4).map((playlist) => (
            <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {newReleases.map((album) => (
            <NewReleaseCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Top Tracks</h2>
        <div className="space-y-4">
          {topTracks.slice(0, 5).map((track) => (
            <TopTrackItem key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Browse Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </section>
    </div>
  );
};

const FeaturedPlaylistCard = ({ playlist }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
  >
    <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
      <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
    </div>
  </motion.div>
);

const NewReleaseCard = ({ album }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex-shrink-0 w-40"
  >
    <img src={album.images[1].url} alt={album.name} className="w-40 h-40 object-cover rounded-lg shadow-lg" />
    <h3 className="mt-2 font-semibold">{album.name}</h3>
    <p className="text-gray-400 text-sm">{album.artists[0].name}</p>
  </motion.div>
);

const TopTrackItem = ({ track }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
  >
    <img src={track.album.images[2].url} alt={track.name} className="w-12 h-12 rounded" />
    <div className="flex-grow">
      <h3 className="font-semibold">{track.name}</h3>
      <p className="text-gray-400 text-sm">{track.artists[0].name}</p>
    </div>
    <div className="flex items-center space-x-2">
      <button className="text-green-500 hover:text-green-400">
        <PlayIcon className="h-6 w-6" />
      </button>
      <button className="text-red-500 hover:text-red-400">
        <HeartIcon className="h-6 w-6" />
      </button>
    </div>
  </motion.div>
);

const GenreCard = ({ genre }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative overflow-hidden rounded-lg shadow-lg"
  >
    <img src={genre.icons[0].url} alt={genre.name} className="w-full h-32 object-cover" />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <h3 className="text-lg font-semibold">{genre.name}</h3>
    </div>
  </motion.div>
);

export default Home;
