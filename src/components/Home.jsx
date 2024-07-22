import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import SpotifyWebApi from "spotify-web-api-js";
import { getSpotifyAccessToken } from "./api";

const spotifyApi = new SpotifyWebApi();

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch data from Spotify API
    const fetchData = async () => {
      try {
        let spotifyToken = await getSpotifyAccessToken();
        spotifyApi.setAccessToken(spotifyToken);

        const token = spotifyToken;
        const headers = { Authorization: `Bearer ${token}` };

        const [playlistsRes, releasesRes, tracksRes, genresRes] =
          await Promise.all([
            axios.get("https://api.spotify.com/v1/browse/featured-playlists", {
              headers,
            }),
            axios.get("https://api.spotify.com/v1/browse/new-releases", {
              headers,
            }),
            axios.get(
              "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks",
              { headers },
            ),
            axios.get("https://api.spotify.com/v1/browse/categories", {
              headers,
            }),
          ]);

        setFeaturedPlaylists(playlistsRes.data.playlists.items);
        setNewReleases(releasesRes.data.albums.items);
        setTopTracks(tracksRes.data.items.map((item) => item.track));
        setGenres(genresRes.data.categories.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white p-4 md:p-8 lg:p-12">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        Welcome to Your Music Universe
      </h1>

      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
          <span className="mr-2">Featured Playlists</span>
          <ChevronRightIcon className="w-6 h-6 text-green-400" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredPlaylists.slice(0, 5).map((playlist) => (
            <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
          <span className="mr-2">New Releases</span>
          <ChevronRightIcon className="w-6 h-6 text-green-400" />
        </h2>
        <div className="flex overflow-x-auto space-x-6 pb-6">
          {newReleases.map((album) => (
            <NewReleaseCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-12">
        <section className="mb-12 lg:w-2/3">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
            <span className="mr-2">Top Tracks</span>
            <ChevronRightIcon className="w-6 h-6 text-green-400" />
          </h2>
          <div className="space-y-4">
            {topTracks.slice(0, 5).map((track) => (
              <TopTrackItem key={track.id} track={track} />
            ))}
          </div>
        </section>

        <section className="lg:w-1/3">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
            <span className="mr-2">Browse Genres</span>
            <ChevronRightIcon className="w-6 h-6 text-green-400" />
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {genres.slice(0, 6).map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
          <span className="mr-2">Discover Weekly</span>
          <ChevronRightIcon className="w-6 h-6 text-green-400" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTracks.slice(5, 8).map((track) => (
            <VerticalTrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
};

const FeaturedPlaylistCard = ({ playlist }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl"
  >
    <div className="relative">
      <img
        src={playlist.images[0].url}
        alt={playlist.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <PlayIcon className="h-12 w-12 text-white" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 truncate">{playlist.name}</h3>
      <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
    </div>
  </motion.div>
);

const NewReleaseCard = ({ album }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 w-40 group">
    <div className="relative">
      <img
        src={album.images[1].url}
        alt={album.name}
        className="w-40 h-40 object-cover rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
        <PlayIcon className="h-12 w-12 text-white" />
      </div>
    </div>
    <h3 className="mt-2 font-semibold truncate">{album.name}</h3>
    <p className="text-gray-400 text-sm truncate">{album.artists[0].name}</p>
  </motion.div>
);

const TopTrackItem = ({ track }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg group hover:bg-gray-700 transition-colors duration-300"
  >
    <img
      src={track.album.images[2].url}
      alt={track.name}
      className="w-12 h-12 rounded"
    />
    <div className="flex-grow">
      <h3 className="font-semibold truncate">{track.name}</h3>
      <p className="text-gray-400 text-sm truncate">{track.artists[0].name}</p>
    </div>
    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    className="relative overflow-hidden rounded-lg shadow-lg aspect-square"
  >
    <img
      src={genre.icons[0].url}
      alt={genre.name}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-4">
      <h3 className="text-lg font-semibold">{genre.name}</h3>
    </div>
  </motion.div>
);

const VerticalTrackCard = ({ track }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
  >
    <div className="relative flex-grow">
      <img
        src={track.album.images[0].url}
        alt={track.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <PlayIcon className="h-16 w-16 text-white" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 truncate">{track.name}</h3>
      <p className="text-gray-400 text-sm truncate">{track.artists[0].name}</p>
    </div>
  </motion.div>
);

export default Home;
