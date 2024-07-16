"use client";

import React, { useState } from "react";

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div
          className={`text-4xl mb-4 transition-colors duration-300 ${isHovered ? "text-blue-500" : "text-gray-600"}`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          onClick={onAction}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
            isHovered
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

// Example usage in a HomePage component
const HomePage: React.FC = () => {
  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // Implement your action logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to NotifyMusic+</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InteractiveCard
          title="Explore Music"
          description="Discover new artists and genres tailored to your taste."
          icon={<i className="fas fa-music"></i>}
          actionLabel="Start Exploring"
          onAction={() => handleAction("explore")}
        />
        <InteractiveCard
          title="Create Playlist"
          description="Curate your perfect mix of songs for any mood or occasion."
          icon={<i className="fas fa-list"></i>}
          actionLabel="Create Now"
          onAction={() => handleAction("create-playlist")}
        />
        <InteractiveCard
          title="Connect with Friends"
          description="Share your favorite tracks and see what your friends are listening to."
          icon={<i className="fas fa-users"></i>}
          actionLabel="Connect"
          onAction={() => handleAction("connect")}
        />
      </div>
    </div>
  );
};

export default HomePage;
