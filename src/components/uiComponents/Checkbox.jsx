import React from "react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";

const Checkbox = ({ checked, iconColor, name, value, handleChange }) => {
  return (
    <div className="flex mr-4">
      <input
        type="checkbox"
        name={name}
        id={name}
        value={value}
        checked={checked}
        className="invisible w-0 h-0"
        onChange={handleChange}
      />
      <label
        className="text-xl font-bold ml-3 text-247-gray-accent2 flex items-center"
        htmlFor={name}
      >
        {checked ? (
          <MdOutlineCheckBox
            color={iconColor}
            className={value ? "mr-2" : ""}
          />
        ) : (
          <MdOutlineCheckBoxOutlineBlank
            color={iconColor}
            className={value ? "mr-2" : ""}
          />
        )}
        {value}
      </label>
    </div>
  );
};

export default Checkbox;
