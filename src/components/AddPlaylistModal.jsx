import React, { useState } from "react";
import DataTable from "./DataTable";
import CenterModal from "./uiComponents/CenterModal";
import Pagination from "./uiComponents/Pagination";
import ContentItemRow from "./ContentItemRow";
import SearchInput from "./uiComponents/SearchInput";
import Button from "./uiComponents/Button";
import Spinner from "./uiComponents/Spinner";
import NoDataBox from "./uiComponents/NoDataBox";
import ErrorBox from "./uiComponents/ErrorBox";

const tableHeaders = [
  "",
  "Title",
  "Duration",
  "Category",
  "Date",
  "Plays",
  "Status",
];

const AddPlaylistModal = ({
  isOpen,
  setIsOpen,
  currentPage,
  indexOfFirstItem,
  indexOfLastItem,
  pages,
  setCurrentPage,
  setShownRows,
  shownRows,
  list,
  listSize,
  loadingData,
  fetchError,
}) => {
  const [checkedContentItem, setCheckedContentItem] = useState([]);

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

  return (
    <CenterModal modalOpen={isOpen} setModalOpen={setIsOpen} width={1100}>
      <div className="mt-10 rounded-md bg-black border-247-dark-text mb-10">
        <div className="flex py-4 px-8">
          <SearchInput />
        </div>
        <DataTable headers={tableHeaders} loadingData={loadingData}>
          {loadingData && (
            <div className="flex items-center justify-center w-full absolute py-14">
              <Spinner size="large" />
            </div>
          )}
          {!loadingData &&
            list.length > 0 &&
            list.map((contentItem, idx) => (
              <ContentItemRow
                checkedItems={checkedContentItem}
                contentItem={contentItem}
                index={idx}
                toggleItemCheck={toggleContentItemCheck}
                key={`contentItem_${idx}`}
                hideAction
                smallText
              />
            ))}
        </DataTable>
        {!loadingData && !fetchError && list.length === 0 && (
          <div className="w-full py-9">
            <NoDataBox
              title="No Campaign Found"
              subtitle="We cannot find any campaign that fits your criteria."
            />
          </div>
        )}
        {!loadingData && fetchError && (
          <div className="w-full py-9">
            <ErrorBox
              title="Error Retrieving Campaigns"
              subtitle={fetchError}
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end mb-20">
        {list && list.length > 0 && (
          <Pagination
            activePage={currentPage}
            dataLength={listSize}
            firstItem={indexOfFirstItem + 1}
            lastItem={indexOfLastItem}
            pages={pages}
            setActivePage={setCurrentPage}
            setVisibleRows={setShownRows}
            visibleRows={shownRows}
          />
        )}
      </div>
      {!fetchError && (
        <Button
          className={[
            "bg-247-red-straight",
            "block",
            "mt-12",
            "px-12",
            "font-normal",
          ]}
          fullWidth
        >
          Add
        </Button>
      )}
    </CenterModal>
  );
};

export default AddPlaylistModal;
