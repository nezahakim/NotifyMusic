// src/components/Navigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Search", path: "/search", icon: MagnifyingGlassIcon },
    { name: "Library", path: "/library", icon: Bars3Icon },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              MusicStream
            </Link>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
