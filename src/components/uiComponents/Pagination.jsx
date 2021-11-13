import React from "react";
import { BiCaretLeft, BiCaretRight } from "react-icons/bi";

const Pagination = ({
  visibleRows,
  setActivePage,
  setVisibleRows,
  firstItem,
  pages,
  activePage,
  dataLength,
  lastItem,
}) => {
  const handleNextBtn = () => {
    setActivePage(activePage + 1);
  };

  const handlePrevBtn = () => {
    setActivePage(activePage - 1);
  };

  return (
    <>
      <div className="flex items-center">
        <p className="text-247-gray-accent2 mr-4 font-customRoboto text-base">
          Show rows:
        </p>
        <select
          name="rows"
          id="rows"
          value={visibleRows}
          onChange={(ev) => {
            setActivePage(1);
            setVisibleRows(ev.target.value);
          }}
          className="px-3 py-1 font-customRoboto text-247-gray-accent2 bg-transparent border-2 rounded-sm focus:outline-none focus:ring-1 border-247-dark-text"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
      <div className="flex ml-16 items-center">
        <p className="text-base text-247-gray-accent2">{`${firstItem} - ${
          pages === activePage ? dataLength : lastItem
        } of ${dataLength}`}</p>
        <div className="ml-3">
          <button
            onClick={activePage === 1 ? null : handlePrevBtn}
            className="px-3 rounded-l-md py-1 border-2 border-247-dark-text"
          >
            <BiCaretLeft size={20} color="#CACACA" />
          </button>
          <button
            onClick={pages === activePage ? null : handleNextBtn}
            className="px-3 rounded-r-md py-1 border-2 border-l-0 border-247-dark-text"
          >
            <BiCaretRight size={20} color="#CACACA" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;
