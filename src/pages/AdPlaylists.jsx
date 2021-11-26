import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import Checkbox from "../components/uiComponents/Checkbox";
import { MdOutlineEdit, MdAdd } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const PlaylistBox = ({ selected, selectFn, title, playlistId }) => {
  return (
    <div className="bg-247-secondary border-2 border-247-dark-text pl-3 pr-12 py-6 rounded-md">
      <Checkbox
        checked={selected}
        handleChange={selectFn}
        name={title}
        // value={playlistId}
        iconColor={selected ? "#fff" : "#4d4d4d"}
      />
      <h3
        className={`text-3xl ml-3 mt-3 font-bold ${
          selected ? "text-white" : "text-247-gray-accent2"
        }`}
      >
        {title}
      </h3>
      <div className="mt-5 ml-3 flex items-center">
        <button className="bg-247-gray-accent3 flex justify-center items-center w-10 h-9 border border-247-dark-text rounded-md">
          <MdOutlineEdit color="#FFFFFF" size={20} />
        </button>
        <button className="bg-247-gray-accent3 flex justify-center items-center w-10 h-9 border border-247-dark-text rounded-md ml-5">
          <RiDeleteBinLine color="#FFFFFF" size={20} />
        </button>
      </div>
    </div>
  );
};

const AdPlaylists = () => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const handlePlaylistSelect = (id) => {
    if (selectedPlaylists.includes(id)) {
      const index = selectedPlaylists.indexOf(id);
      const newSelectedPlaylists = [...selectedPlaylists];
      newSelectedPlaylists.splice(index, 1);
      setSelectedPlaylists(newSelectedPlaylists);
    } else {
      setSelectedPlaylists([...selectedPlaylists, id]);
    }
  };

  return (
    <Dashboard pageTitle="Ad-Playlists">
      <div className="grid grid-cols-3 gap-6 mt-16">
        <PlaylistBox
          selectFn={() => handlePlaylistSelect("core")}
          title="Core / General Playlist"
          playlistId="core"
          selected={selectedPlaylists.includes("core")}
        />
        <PlaylistBox
          selectFn={() => handlePlaylistSelect("black-friday")}
          title="Black Friday Playlist"
          playlistId="black-friday"
          selected={selectedPlaylists.includes("black-friday")}
        />
        <div className="w-full bg-247-secondary border-2 border-247-dark-text cursor-pointer rounded-md h-full flex items-center justify-center">
          <MdAdd color="#4D4D4D" size={55} />
        </div>
      </div>
    </Dashboard>
  );
};

export default AdPlaylists;
