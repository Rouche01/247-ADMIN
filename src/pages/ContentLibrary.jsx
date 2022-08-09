import React, { useContext, useEffect, useState, useMemo } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import Dashboard from "../components/Dashboard";
import DataTable from "../components/DataTable";
import Pagination from "../components/uiComponents/Pagination";
import { usePagination } from "../hooks/pagination";
import RoundedBtnWithIcon from "../components/uiComponents/RoundedBtnWithIcon";
import Spinner from "../components/uiComponents/Spinner";
import NoDataBox from "../components/uiComponents/NoDataBox";
import ErrorBox from "../components/uiComponents/ErrorBox";
import UploadContentModal from "../components/uiComponents/UploadContentModal";
import ContentItemRow from "../components/ContentItemRow";
import ConfirmationModal from "../components/uiComponents/ConfirmationModal";
import { Context as ContentLibraryContext } from "../context/ContentLibraryContext";
import { Context as PlaylistContext } from "../context/PlaylistContext";
import { convertMMSSToSec, convertSecToMMSS } from "../utils/numFormatter";
import { useToastError } from "../hooks/handleError";

const tableHeaders = [
  "",
  "Title",
  "Duration",
  "Category",
  "Date",
  "Plays",
  "Status",
  "",
];

const ContentLibrary = () => {
  const [checkedContentItem, setCheckedContentItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const [currentMediaItem, setCurrentMediaItem] = useState();

  const [contentMedia, setContentMedia] = useState([]);
  const [contentDuration, setContentDuration] = useState(0);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const {
    state: {
      creatingContent,
      createError,
      fetchingMediaItems,
      deletingItem,
      deleteItemError,
      mediaItems,
      mediaItemsSize,
      fetchItemsError,
    },
    createContentItem,
    fetchMediaItems,
    deleteMediaItem,
    clearError,
  } = useContext(ContentLibraryContext);

  const {
    state: { addingItemToPlaylist, playlistAddedFail },
    addItemToPlaylist,
    clearError: clearPlaylistError,
  } = useContext(PlaylistContext);

  useToastError(createError, () => {
    clearError("create");
  });

  useToastError(deleteItemError, () => {
    clearError("deleteItem");
  });

  useToastError(playlistAddedFail, () => {
    clearPlaylistError("addToPlaylist");
  });

  const paginationOptions = useMemo(
    () => ({
      limit: shownRows,
      skip: (currentPage - 1) * shownRows,
    }),
    [shownRows, currentPage]
  );

  useEffect(() => {
    fetchMediaItems({ ...paginationOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationOptions]);

  const { indexOfFirstItem, indexOfLastItem, pages } = usePagination(
    currentPage,
    shownRows,
    mediaItems,
    mediaItemsSize
  );

  const toggleContentItemCheck = (idx) => {
    if (checkedContentItem.includes(idx)) {
      const index = checkedContentItem.indexOf(idx);
      const newCheckedAdvertisers = [...checkedContentItem];
      newCheckedAdvertisers.splice(index, 1);
      setCheckedContentItem(newCheckedAdvertisers);
    } else {
      setCheckedContentItem([...checkedContentItem, idx]);
    }
  };

  const createContentCallback = () => {
    toast.success("New content created!");
    return fetchMediaItems({ ...paginationOptions });
  };

  const deleteContentCallback = () => {
    toast.success("Media item deleted successfully!");
    return fetchMediaItems({ ...paginationOptions });
  };

  const handleUploadNewContent = async (data) => {
    console.log(data, "uploading new content...");
    console.log(contentMedia, convertSecToMMSS(contentDuration));

    let formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("duration", convertSecToMMSS(contentDuration));
    formData.append("mediaItem", contentMedia[0]);

    await createContentItem(formData, createContentCallback);

    setUploadModalOpen(false);
  };

  const handleRemoveItemFromPlaylist = (item) => {
    console.log(item, "removing item from playlist...");
  };

  const handleAddItemToPlaylist = async (item) => {
    console.log(item, "adding item to playlist...");
    const { id, duration, mediaUri, title } = item;

    await addItemToPlaylist(
      {
        title,
        mediaUrl: mediaUri,
        durationInSeconds: convertMMSSToSec(duration),
        resourceRef: id,
        modelType: "MediaItem",
        mediaType: "video",
        contentType: "non-campaign",
      },
      () => {
        toast.success("Item added to playlist successfully!");
        return fetchMediaItems({ ...paginationOptions });
      }
    );
  };

  const handleDeleteContentItem = async () => {
    await deleteMediaItem(currentMediaItem.mediaId, deleteContentCallback);
    setConfirmDeleteOpen(false);
  };

  return (
    <Dashboard>
      <div className="mt-20 rounded-md bg-247-secondary border-2 border-247-dark-text mb-10">
        <div className="flex py-4 px-8 justify-end">
          <RoundedBtnWithIcon
            title="Upload Content"
            icon={<FiUploadCloud className="mr-3" size={22} />}
            onBtnClick={() => setUploadModalOpen(true)}
          />
        </div>
        <DataTable headers={tableHeaders} loadingData={fetchingMediaItems}>
          {fetchingMediaItems && (
            <div className="flex items-center justify-center w-full absolute py-14">
              <Spinner size="large" />
            </div>
          )}
          {!fetchingMediaItems &&
            mediaItems.length > 0 &&
            mediaItems.map((contentItem, idx) => (
              <ContentItemRow
                checkedItems={checkedContentItem}
                contentItem={contentItem}
                index={idx}
                toggleItemCheck={toggleContentItemCheck}
                key={`contentItem_${idx}`}
                setConfirmItemDelete={setConfirmDeleteOpen}
                removeItemFromPlaylist={handleRemoveItemFromPlaylist}
                addItemToPlaylist={handleAddItemToPlaylist}
                setCurrentItem={setCurrentMediaItem}
              />
            ))}
        </DataTable>
        {!fetchingMediaItems && !fetchItemsError && mediaItems.length === 0 && (
          <div className="w-full py-9">
            <NoDataBox
              title="No Campaign Found"
              subtitle="We cannot find any campaign that fits your criteria."
            />
          </div>
        )}
        {!fetchingMediaItems && fetchItemsError && (
          <div className="w-full py-9">
            <ErrorBox
              title="Error Retrieving Campaigns"
              subtitle={fetchItemsError}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end mb-20">
        {mediaItems && mediaItems.length > 0 && (
          <Pagination
            activePage={currentPage}
            dataLength={mediaItemsSize}
            firstItem={indexOfFirstItem + 1}
            lastItem={indexOfLastItem}
            pages={pages}
            setActivePage={setCurrentPage}
            setVisibleRows={setShownRows}
            visibleRows={shownRows}
          />
        )}
      </div>
      <UploadContentModal
        isOpen={uploadModalOpen}
        setIsOpen={setUploadModalOpen}
        handleUpload={handleUploadNewContent}
        setMediaItem={setContentMedia}
        setMediaDuration={setContentDuration}
        creatingContent={creatingContent}
      />
      <ConfirmationModal
        open={confirmDeleteOpen}
        setOpen={setConfirmDeleteOpen}
        text="Are you sure you want to delete this content?"
        icon={<FaRegTrashAlt size={28} color="#fff" />}
        handleConfirmation={handleDeleteContentItem}
        processingConfirm={deletingItem}
      />
    </Dashboard>
  );
};

export default ContentLibrary;
