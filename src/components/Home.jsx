// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { PlayIcon, PauseIcon, HeartIcon } from "@heroicons/react/24/solid";

// const Home = () => {
//   const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
//   const [newReleases, setNewReleases] = useState([]);
//   const [topTracks, setTopTracks] = useState([]);
//   const [genres, setGenres] = useState([]);

//   const CLIENT_ID = "44e86430da7d4bd7ae36d59f81aff51e";
//   const CLIENT_SECRET = "52dc1ffae8724a98a73dd92b1123074f";

//   let spotifyToken = "";

//   const getSpotifyToken = async () => {
//     const response = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization:
//           "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
//       },
//       body: "grant_type=client_credentials",
//     });
//     const data = await response.json();
//     spotifyToken = data.access_token;
//   };
//   getSpotifyToken();
//   useEffect(() => {
//     // Fetch data from Spotify API
//     const fetchData = async () => {
//       try {
//         const token = spotifyToken;
//         const headers = { Authorization: `Bearer ${token}` };

//         const [playlistsRes, releasesRes, tracksRes, genresRes] =
//           await Promise.all([
//             axios.get("https://api.spotify.com/v1/browse/featured-playlists", {
//               headers,
//             }),
//             axios.get("https://api.spotify.com/v1/browse/new-releases", {
//               headers,
//             }),
//             axios.get(
//               "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks",
//               { headers },
//             ),
//             axios.get("https://api.spotify.com/v1/browse/categories", {
//               headers,
//             }),
//           ]);

//         setFeaturedPlaylists(playlistsRes.data.playlists.items);
//         setNewReleases(releasesRes.data.albums.items);
//         setTopTracks(tracksRes.data.items.map((item) => item.track));
//         setGenres(genresRes.data.categories.items);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-8">
//       <h1 className="text-4xl font-bold mb-8">Welcome to Your Music</h1>

//       <section className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">Featured Playlists</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {featuredPlaylists.slice(0, 4).map((playlist) => (
//             <FeaturedPlaylistCard key={playlist.id} playlist={playlist} />
//           ))}
//         </div>
//       </section>

//       <section className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
//         <div className="flex overflow-x-auto space-x-4 pb-4">
//           {newReleases.map((album) => (
//             <NewReleaseCard key={album.id} album={album} />
//           ))}
//         </div>
//       </section>

//       <section className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">Top Tracks</h2>
//         <div className="space-y-4">
//           {topTracks.slice(0, 5).map((track) => (
//             <TopTrackItem key={track.id} track={track} />
//           ))}
//         </div>
//       </section>

//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Browse Genres</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//           {genres.map((genre) => (
//             <GenreCard key={genre.id} genre={genre} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// const FeaturedPlaylistCard = ({ playlist }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
//   >
//     <img
//       src={playlist.images[0].url}
//       alt={playlist.name}
//       className="w-full h-48 object-cover"
//     />
//     <div className="p-4">
//       <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
//       <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
//     </div>
//   </motion.div>
// );

// const NewReleaseCard = ({ album }) => (
//   <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 w-40">
//     <img
//       src={album.images[1].url}
//       alt={album.name}
//       className="w-40 h-40 object-cover rounded-lg shadow-lg"
//     />
//     <h3 className="mt-2 font-semibold">{album.name}</h3>
//     <p className="text-gray-400 text-sm">{album.artists[0].name}</p>
//   </motion.div>
// );

// const TopTrackItem = ({ track }) => (
//   <motion.div
//     whileHover={{ scale: 1.02 }}
//     className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
//   >
//     <img
//       src={track.album.images[2].url}
//       alt={track.name}
//       className="w-12 h-12 rounded"
//     />
//     <div className="flex-grow">
//       <h3 className="font-semibold">{track.name}</h3>
//       <p className="text-gray-400 text-sm">{track.artists[0].name}</p>
//     </div>
//     <div className="flex items-center space-x-2">
//       <button className="text-green-500 hover:text-green-400">
//         <PlayIcon className="h-6 w-6" />
//       </button>
//       <button className="text-red-500 hover:text-red-400">
//         <HeartIcon className="h-6 w-6" />
//       </button>
//     </div>
//   </motion.div>
// );

// const GenreCard = ({ genre }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className="relative overflow-hidden rounded-lg shadow-lg"
//   >
//     <img
//       src={genre.icons[0].url}
//       alt={genre.name}
//       className="w-full h-32 object-cover"
//     />
//     <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <h3 className="text-lg font-semibold">{genre.name}</h3>
//     </div>
//   </motion.div>
// );

// export default Home;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PlayIcon, PauseIcon, HeartIcon } from "@heroicons/react/24/solid";

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const JAMENDO_CLIENT_ID = "e1372904";
  const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";

  const fetchFromJamendo = async (endpoint, params = {}) => {
    const queryParams = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: "json",
      ...params,
    });
    const response = await axios.get(
      `${JAMENDO_BASE_URL}${endpoint}?${queryParams}`,
    );
    return response.data.results;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlists, releases, tracks, categories] = await Promise.all([
          fetchFromJamendo("/playlists", { limit: 4 }),
          fetchFromJamendo("/albums", { limit: 8 }),
          fetchFromJamendo("/tracks", { limit: 5, order: "popularity_total" }),
          fetchFromJamendo("/tags", { type: "genre", limit: 10 }),
        ]);

        setFeaturedPlaylists(playlists);
        setNewReleases(releases);
        setTopTracks(tracks);
        setGenres(categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        document.getElementById(track.id).pause();
      } else {
        document.getElementById(track.id).play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (currentTrack) {
        document.getElementById(currentTrack.id).pause();
      }
      setCurrentTrack(track);
      setIsPlaying(true);
      document.getElementById(track.id).play();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Your Music</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredPlaylists.map((playlist) => (
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
          {topTracks.map((track) => (
            <TopTrackItem key={track.id} track={track} playTrack={playTrack} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Browse Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <GenreCard key={genre.name} genre={genre} />
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
    <img
      src={playlist.image}
      alt={playlist.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
      <p className="text-gray-400 text-sm">{playlist.trackcount} tracks</p>
    </div>
  </motion.div>
);

const NewReleaseCard = ({ album }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 w-40">
    <img
      src={album.image}
      alt={album.name}
      className="w-40 h-40 object-cover rounded-lg shadow-lg"
    />
    <h3 className="mt-2 font-semibold">{album.name}</h3>
    <p className="text-gray-400 text-sm">{album.artist_name}</p>
  </motion.div>
);

const TopTrackItem = ({ track, playTrack }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
  >
    <img
      src={track.album_image}
      alt={track.name}
      className="w-12 h-12 rounded"
    />
    <div className="flex-grow">
      <h3 className="font-semibold">{track.name}</h3>
      <p className="text-gray-400 text-sm">{track.artist_name}</p>
    </div>
    <div className="flex items-center space-x-2">
      <button
        className={`text-green-500 hover:text-green-400 ${track.id}`}
        onClick={() => playTrack(track)}
      >
        {track.id === currentTrack?.id && isPlaying ? (
          <PauseIcon className="h-6 w-6" />
        ) : (
          <PlayIcon className="h-6 w-6" />
        )}
      </button>
      <audio id={track.id} src={track.audio}></audio>
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
      src={genre.image}
      alt={genre.name}
      className="w-full h-32 object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <h3 className="text-lg font-semibold">{genre.name}</h3>
    </div>
  </motion.div>
);

export default Home;
