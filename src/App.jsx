// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "react-hot-toast";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Search from "./components/Search";
import Library from "./components/Library";
import Player from "./components/Player";
import DarkModeToggle from "./components/DarkModeToggle";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AnimatedBackground />
        <div className="min-h-screen flex flex-col dark:bg-gray-900">
          <Navigation />
          <main className="flex-grow container mx-auto px-0 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </main>
          <Player />
          {/* <DarkModeToggle /> */}
        </div>
      </Router>
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
