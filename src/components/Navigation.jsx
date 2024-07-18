import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  PlusCircleIcon,
  HeartIcon,
  UserCircleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Search', icon: MagnifyingGlassIcon, path: '/search' },
    { name: 'Your Library', icon: BookmarkIcon, path: '/library' },
    { name: 'Create Playlist', icon: PlusCircleIcon, path: '/create-playlist' },
    { name: 'Liked Songs', icon: HeartIcon, path: '/liked-songs' },
  ];

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <UserMenu />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <MobileNavItem key={item.name} item={item} />
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-10 w-10" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none">Tom Cook</div>
                <div className="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Settings
              </Link>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Logo = () => (
  <div className="flex items-center">
    <span className="font-bold text-xl text-green-500">NotifyMusic</span>
    <span className="font-bold text-xl text-pink-500">+</span>
  </div>
);

const NavItem = ({ item }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={item.path}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      <item.icon className="inline-block h-5 w-5 mr-2" />
      {item.name}
    </Link>
  </motion.div>
);

const MobileNavItem = ({ item }) => (
  <Link
    to={item.path}
    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
  >
    <item.icon className="inline-block h-5 w-5 mr-2" />
    {item.name}
  </Link>
);

const UserMenu = () => (
  <div className="ml-3 relative">
    <div>
      <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
        <span className="sr-only">Open user menu</span>
        <UserCircleIcon className="h-8 w-8" />
      </button>
    </div>
  </div>
);

export default Navigation;
