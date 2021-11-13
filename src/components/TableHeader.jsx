import React from "react";
import DatePicker from "react-datepicker";
import { FiChevronDown } from "react-icons/fi";
import SearchInput from "./uiComponents/SearchInput";

const TableHeader = ({ startDate, endDate, setRange, tableTitle }) => {
  return (
    <div className="flex pt-7 px-8 mb-8 items-center justify-between">
      <h3 className="font-customRoboto text-white font-medium text-2xl">
        {tableTitle}
      </h3>
      <div className="flex">
        <div className="relative mr-8">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setRange(update)}
          />
          <FiChevronDown
            className="absolute top-1/4 right-3 cursor-pointer z-0"
            size={20}
            color="#979797"
          />
        </div>
        <SearchInput />
      </div>
    </div>
  );
};

export default TableHeader;
