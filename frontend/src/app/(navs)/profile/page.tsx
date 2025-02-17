"use client"
import { useState } from 'react';
import Image from "next/image";
import { Settings, Music, Clock, Heart, Edit, LogOut } from "@/utils/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Account = () => {
  const userProfile = {
    name: "Alex Johnson",
    username: "@alexjohnson",
    bio: "Music producer & DJ 🎧 | Creating vibes",
    avatar: "/cover.jpeg",
    followers: 1234,
    following: 567
  };

  const recentTracks = [
    { id: 1, name: "Summer Vibes", plays: 1234, duration: "3:45", cover: "/cover.jpeg" },
    { id: 2, name: "Night Drive", plays: 856, duration: "4:20", cover: "/cover.jpeg" },
    { id: 3, name: "Chill Waves", plays: 567, duration: "3:15", cover: "/cover.jpeg" }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-32 w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl" />
          <div className="absolute -bottom-16 left-4 flex items-end space-x-4">
            <Image
              src={userProfile.avatar}
              width={96}
              height={96}
              alt={userProfile.name}
              className="rounded-full border-4 border-white"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{userProfile.name}</h1>
              <p className="text-gray-600">{userProfile.username}</p>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <p className="text-gray-700">{userProfile.bio}</p>

          <div className="flex space-x-4 text-sm">
            <span className="text-gray-600">
              <strong className="text-gray-800">{userProfile.followers}</strong> followers
            </span>
            <span className="text-gray-600">
              <strong className="text-gray-800">{userProfile.following}</strong> following
            </span>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4">
            {recentTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={track.cover}
                    width={48}
                    height={48}
                    alt={track.name}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{track.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{track.duration}</span>
                      <span>•</span>
                      <Music className="w-4 h-4" />
                      <span>{track.plays}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="liked">
            <div className="text-center py-8 text-gray-500">
              Your liked tracks will appear here
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="text-center py-8 text-gray-500">
              Your playlists will appear here
            </div>
          </TabsContent>
        </Tabs>

        {/* Settings Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Settings</span>
            </div>
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;