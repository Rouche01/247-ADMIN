import React, { useContext, useEffect, useState, useMemo } from "react";
import { MdAdd } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

import PlaylistItemRow from "../components/PlaylistItemRow";
import DraggableTable from "../components/DraggableTable";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import AddPlaylistModal from "../components/AddPlaylistModal";
import Dashboard from "../components/Dashboard";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import Pagination from "../components/uiComponents/Pagination";
import Spinner from "../components/uiComponents/Spinner";
import ErrorBox from "../components/uiComponents/ErrorBox";
import NoDataBox from "../components/uiComponents/NoDataBox";
import { usePagination } from "../hooks/pagination";

import { Context as PlaylistContext } from "../context/PlaylistContext";
import { Context as ContentLibraryContext } from "../context/ContentLibraryContext";
import toast from "react-hot-toast";
import { useToastError } from "../hooks/handleError";

const tableHeaders = ["", "Title", "Duration", "Date Added", "Action"];

const PlaylistManager = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const [contentCurrentPage, setContentCurrentPage] = useState(1);
  const [contentShownRows, setContentShownRows] = useState(5);

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const [currenyPlaylistItem, setCurrentPlaylistItem] = useState();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [playlistItems, setPlaylistItems] = useState([]);
  const {
    state: {
      generalPlaylist,
      fetchingGeneralPlaylist,
      fetchGeneralPlaylistErr,
      deletingPlaylistItem,
      playlistDeleteError,
    },
    fetchGeneralPlaylist,
    deletePlaylistItem,
    clearError: clearPlaylistError,
  } = useContext(PlaylistContext);

  const {
    state: { mediaItems, mediaItemsSize, fetchItemsError, fetchingMediaItems },
    fetchMediaItems,
  } = useContext(ContentLibraryContext);

  const paginationOptions = useMemo(
    () => ({
      limit: contentShownRows,
      skip: (contentCurrentPage - 1) * contentShownRows,
    }),
    [contentShownRows, contentCurrentPage]
  );

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchGeneralPlaylist(),
        fetchMediaItems({ ...paginationOptions }),
      ]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPlaylistItems(generalPlaylist);
  }, [generalPlaylist]);

  useToastError(playlistDeleteError, () => {
    clearPlaylistError("deleteItem");
  });

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(
      currentPage,
      shownRows,
      playlistItems,
      generalPlaylist.length
    );

  const {
    indexOfFirstItem: indexOfFirstItemForContent,
    indexOfLastItem: indexOfLastItemForContent,
    pages: contentPages,
  } = usePagination(
    contentCurrentPage,
    contentShownRows,
    mediaItems,
    mediaItemsSize
  );

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

  const removeItemFromPlaylist = async () => {
    await deletePlaylistItem(currenyPlaylistItem.id, () => {
      toast.success("Playlist item removed successfully");
      return fetchGeneralPlaylist();
    });
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
          {!fetchingGeneralPlaylist &&
            generalPlaylist.length > 0 &&
            currentList.map((playlistItem, idx) => (
              <PlaylistItemRow
                playlistItem={playlistItem}
                key={`playlistItem${idx}`}
                index={idx}
                draggableId={playlistItem.id}
                onDownwardMove={moveItemDown}
                onUpwardMove={moveItemUp}
                setConfirmRemoveItem={setConfirmRemoveOpen}
                setCurrentItem={setCurrentPlaylistItem}
              />
            ))}
        </DraggableTable>
        {fetchingGeneralPlaylist && (
          <div className="w-full py-12 bg-black">
            <Spinner size="large" />
          </div>
        )}
        {!fetchingGeneralPlaylist && fetchGeneralPlaylistErr && (
          <div className="w-full py-9 bg-black">
            <ErrorBox
              title="Error Retrieving Playlist"
              subtitle={fetchGeneralPlaylistErr}
            />
          </div>
        )}
        {!fetchingGeneralPlaylist &&
          !fetchGeneralPlaylistErr &&
          generalPlaylist.length === 0 && (
            <div className="w-full py-9">
              <NoDataBox
                title="No Campaign Found"
                subtitle="We cannot find any campaign that fits your criteria."
              />
            </div>
          )}
      </div>
      <div className="flex items-center justify-end mb-20 mt-12">
        {generalPlaylist && generalPlaylist.length > 0 && (
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
        )}
      </div>
      <AddPlaylistModal
        isOpen={addModalOpen}
        setIsOpen={setAddModalOpen}
        currentPage={contentCurrentPage}
        indexOfFirstItem={indexOfFirstItemForContent}
        indexOfLastItem={indexOfLastItemForContent}
        list={mediaItems}
        listSize={mediaItemsSize}
        pages={contentPages}
        setCurrentPage={setContentCurrentPage}
        setShownRows={setContentShownRows}
        shownRows={contentShownRows}
        fetchError={fetchItemsError}
        loadingData={fetchingMediaItems}
      />
      <ConfirmationModal
        open={confirmRemoveOpen}
        setOpen={setConfirmRemoveOpen}
        text="Are you sure you want to remove this item from the playlist?"
        icon={<FaRegTrashAlt size={28} color="#fff" />}
        handleConfirmation={removeItemFromPlaylist}
        processingConfirm={deletingPlaylistItem}
      />
    </Dashboard>
  );
};

export default PlaylistManager;
