import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import Pagination from "../components/uiComponents/Pagination";
import { usePagination } from "../hooks/pagination";
import { contentLibrary } from "../utils/dummyData";
import { MdAdd } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import PlaylistItemRow from "../components/PlaylistItemRow";
import DraggableTable from "../components/DraggableTable";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import AddPlaylistModal from "../components/AddPlaylistModal";

const tableHeaders = ["", "Title", "Duration", "Date Added", "Action"];

const PlaylistManager = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [playlistItems, setPlaylistItems] = useState(contentLibrary);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, playlistItems);

  const reOrderPlaylist = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (e) => {
    console.log(e);
    if (!e.destination) {
      return;
    }
    const sorted = reOrderPlaylist(
      playlistItems,
      e.source.index,
      e.destination.index
    );
    console.log(sorted);
    setPlaylistItems(sorted);
  };

  const moveItemDown = (item) => {
    console.log(item, "moving item down...");
  };

  const moveItemUp = (item) => {
    console.log(item, "moving up...");
  };

  const removeItemFromPlaylist = () => {
    setConfirmRemoveOpen(false);
    console.log("removing item from playlist...");
  };

  return (
    <Dashboard pageTitle="Ad-Playlists">
      <div className="flex items-center justify-between mt-16">
        <h3 className="text-white text-3xl font-semibold">Live Playlist</h3>
        <RoundedBtnWithIcon
          title="Add Content"
          icon={<MdAdd className="mr-2" size={22} />}
          onBtnClick={() => setAddModalOpen(true)}
        />
      </div>
      <div className="mt-16">
        <DraggableTable
          handleDragEnd={onDragEnd}
          droppableId="playlist-table"
          headers={tableHeaders}
        >
          {currentList.map((playlistItem, idx) => (
            <PlaylistItemRow
              playlistItem={playlistItem}
              key={`playlistItem${idx}`}
              index={idx}
              draggableId={playlistItem.id}
              onDownwardMove={moveItemDown}
              onUpwardMove={moveItemUp}
              setConfirmRemoveItem={setConfirmRemoveOpen}
            />
          ))}
        </DraggableTable>
      </div>
      <div className="flex items-center justify-end mb-20 mt-12">
        <Pagination
          activePage={currentPage}
          dataLength={playlistItems.length}
          firstItem={indexOfFirstItem + 1}
          lastItem={indexOfLastItem}
          pages={pages}
          setActivePage={setCurrentPage}
          setVisibleRows={setShownRows}
          visibleRows={shownRows}
        />
      </div>
      <AddPlaylistModal isOpen={addModalOpen} setIsOpen={setAddModalOpen} />
      <ConfirmationModal
        open={confirmRemoveOpen}
        setOpen={setConfirmRemoveOpen}
        text="Are you sure you want to remove this item from the playlist?"
        icon={<FaRegTrashAlt size={28} color="#fff" />}
        handleConfirmation={removeItemFromPlaylist}
      />
    </Dashboard>
  );
};

export default PlaylistManager;
