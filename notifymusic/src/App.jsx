// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Search from "./components/Search";
import Library from "./components/Library";
import Player from "./components/Player";
import DarkModeToggle from "./components/DarkModeToggle";

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
          <Navigation />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
            </Routes>
          </main>
          <Player />
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
