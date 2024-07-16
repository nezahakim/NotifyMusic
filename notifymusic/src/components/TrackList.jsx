// src/components/TrackList.jsx
import React from "react";
import TrackItem from "./TrackItem";

const TrackList = ({ tracks }) => {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  );
};

export default TrackList;
