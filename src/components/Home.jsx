import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PlayIcon, PauseIcon, HeartIcon } from "@heroicons/react/24/solid";
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
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-8">
      <h1 className="flex item-center-flex text-4xl font-bold mb-8">Music+</h1>

      {/* <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Trending Now</h2>
        <div className="grid grid-cols-4 gap-6">
          <FeaturedCard
            item={featuredPlaylists[0]}
            type="playlist"
            className="col-span-2 row-span-2"
          />
          <FeaturedCard
            item={newReleases[0]}
            type="album"
            className="col-span-1 row-span-1"
          />
          <FeaturedCard
            item={topTracks[0]}
            type="track"
            className="col-span-1 row-span-1"
          />
          <FeaturedCard
            item={newReleases[1]}
            type="album"
            className="col-span-1 row-span-1"
          />
          <FeaturedCard
            item={topTracks[1]}
            type="track"
            className="col-span-1 row-span-1"
          />
        </div>
      </section>
 */}
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

      <div className="flex flex-col lg:flex-row gap-8">
        <section className="mb-12 lg:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Top Tracks</h2>
          <div className="space-y-4">
            {topTracks.slice(0, 5).map((track) => (
              <TopTrackItem key={track.id} track={track} />
            ))}
          </div>
        </section>

        <section className="lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Browse Genres</h2>
          <div className="grid grid-cols-2 gap-4">
            {genres.map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const FeaturedCard = ({ item, type, className }) => {
  if (!item) return null;

  let image, title, subtitle;

  switch (type) {
    case "playlist":
      image = item.images[0].url;
      title = item.name;
      subtitle = `${item.tracks.total} tracks`;
      break;
    case "album":
      image = item.images[0].url;
      title = item.name;
      subtitle = item.artists[0].name;
      break;
    case "track":
      image = item.album.images[0].url;
      title = item.name;
      subtitle = item.artists[0].name;
      break;
    default:
      return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
    >
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-300">{subtitle}</p>
        <button className="mt-2 bg-green-500 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center">
          <PlayIcon className="h-6 w-6" />
        </button>
      </div>
    </motion.div>
  );
};

const FeaturedPlaylistCard = ({ playlist }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
  >
    <img
      src={playlist.images[0].url}
      alt={playlist.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
      <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
    </div>
  </motion.div>
);

const NewReleaseCard = ({ album }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 w-40">
    <img
      src={album.images[1].url}
      alt={album.name}
      className="w-40 h-40 object-cover rounded-lg shadow-lg"
    />
    <h3 className="mt-2 font-semibold">{album.name}</h3>
    <p className="text-gray-400 text-sm">{album.artists[0].name}</p>
  </motion.div>
);

const TopTrackItem = ({ track }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
  >
    <img
      src={track.album.images[2].url}
      alt={track.name}
      className="w-12 h-12 rounded"
    />
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
    <img
      src={genre.icons[0].url}
      alt={genre.name}
      className="w-full h-32 object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <h3 className="text-lg font-semibold">{genre.name}</h3>
    </div>
  </motion.div>
);

export default Home;
