import React, { useState } from "react";
import { usePagination } from "../hooks/pagination";
import { contentLibrary } from "../utils/dummyData";
import DataTable from "./DataTable";
import CenterModal from "./uiComponents/CenterModal";
import Pagination from "./uiComponents/Pagination";
import ContentItemRow from "./ContentItemRow";
import SearchInput from "./uiComponents/SearchInput";
import Button from "./uiComponents/Button";

const tableHeaders = [
  "",
  "Title",
  "Duration",
  "Category",
  "Date",
  "Plays",
  "Status",
];

const AddPlaylistModal = ({ isOpen, setIsOpen }) => {
  const [checkedContentItem, setCheckedContentItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownRows, setShownRows] = useState(5);

  const { currentList, indexOfFirstItem, indexOfLastItem, pages } =
    usePagination(currentPage, shownRows, contentLibrary);

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
        <DataTable headers={tableHeaders}>
          {currentList.map((contentItem, idx) => (
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
      </div>
      <div className="flex items-center justify-end mb-20">
        <Pagination
          activePage={currentPage}
          dataLength={contentLibrary.length}
          firstItem={indexOfFirstItem + 1}
          lastItem={indexOfLastItem}
          pages={pages}
          setActivePage={setCurrentPage}
          setVisibleRows={setShownRows}
          visibleRows={shownRows}
        />
      </div>
      <Button
        className={["bg-247-red-straight", "block", "mt-12", "px-12", "font-normal"]}
        fullWidth
      >
        Add
      </Button>
    </CenterModal>
  );
};

export default AddPlaylistModal;
