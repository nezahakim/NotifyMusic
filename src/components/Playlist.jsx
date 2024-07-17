// src/components/Playlist.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { updatePlaylistOrder } from "../store/slices/playlistSlice";
import TrackItem from "./TrackItem";

const Playlist = () => {
  const dispatch = useDispatch();
  const { playlists } = useSelector((state) => state.playlist);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(playlists);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(updatePlaylistOrder(items));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="playlist">
        {(provided) => (
          <motion.ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {playlists.map((playlist, index) => (
              <Draggable
                key={playlist.id}
                draggableId={playlist.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${
                      snapshot.isDragging ? "shadow-lg" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <TrackItem track={playlist} />
                    </motion.div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </motion.ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Playlist;
