// src/components/Navigation.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  MusicalNoteIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Search", path: "/search", icon: MagnifyingGlassIcon },
    { name: "Library", path: "/library", icon: MusicalNoteIcon },
    { name: "Profile", path: "/profile", icon: UserCircleIcon },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor:
          scrollPosition > 20 ? "rgba(17, 24, 39, 0.8)" : "rgba(17, 24, 39, 1)",
        backdropFilter: scrollPosition > 20 ? "blur(10px)" : "blur(0px)",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
          >
            NotifyMusic+
          </Link>
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} location={location} />
            ))}
          </div>
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 shadow-lg"
          >
            <div className="container mx-auto px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  item={item}
                  location={location}
                  onClick={() => setIsMenuOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({ item, location, onClick }) => (
  <Link
    to={item.path}
    className="group relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
    onClick={onClick}
  >
    <item.icon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-white transition-colors duration-300" />
    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
      {item.name}
    </span>
    {location.pathname === item.path && (
      <motion.div
        layoutId="activeNavItem"
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md -z-10"
        initial={false}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </Link>
);

export default Navigation;
