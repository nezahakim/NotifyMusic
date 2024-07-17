// src/components/Navigation.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Search", path: "/search", icon: MagnifyingGlassIcon },
    { name: "Library", path: "/library", icon: Bars3Icon },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300"
          >
            MusicStream
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} location={location} />
            ))}
          </div>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
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
    </nav>
  );
};

const NavLink = ({ item, location, onClick }) => (
  <Link
    to={item.path}
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      location.pathname === item.path
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`}
    onClick={onClick}
  >
    <item.icon className="h-5 w-5 mr-2" />
    {item.name}
  </Link>
);

export default Navigation;
