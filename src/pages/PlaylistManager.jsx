import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import { MdAdd } from "react-icons/md";

const PlaylistManager = () => {
  return (
    <Dashboard pageTitle="Ad-Playlists">
      <div className="flex items-center justify-between mt-16">
        <h3 className="text-white text-3xl font-semibold">Live Playlist</h3>
        <RoundedBtnWithIcon
          title="Add Content"
          icon={<MdAdd className="mr-2" size={22} />}
        />
      </div>
    </Dashboard>
  );
};

export default PlaylistManager;
