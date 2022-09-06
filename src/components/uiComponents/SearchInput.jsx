import React from "react";
import { MdOutlineSearch } from "react-icons/md";

const SearchInput = ({ value, handleChange, placeholderText }) => {
  return (
    <div className="relative">
      <input
        className="pr-4 pl-11 py-2 w-72 border border-247-dark-text rounded-md text-lg text-white focus:outline-none focus:ring-1 font-customRoboto bg-transparent overflow-ellipsis"
        type="search"
        placeholder={placeholderText || "Search"}
        value={value}
        onChange={(ev) => handleChange(ev.target.value)}
      />
      <span className="absolute top-1/4 left-3">
        <MdOutlineSearch color="#979797" size={24} />
      </span>
    </div>
  );
};

export default SearchInput;
