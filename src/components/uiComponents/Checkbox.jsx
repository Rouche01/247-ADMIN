import classNames from "classnames";
import React from "react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";

const Checkbox = ({ checked, iconColor, name, value, handleChange }) => {
  return (
    <div className="flex justify-center items-center">
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
        className={classNames([
          { "text-xl": !!value },
          { "font-bold": !!value },
          { "ml-3": !!value },
          { "text-247-gray-accent2": !!value },
          "flex",
          "items-center",
        ])}
        htmlFor={name}
      >
        {checked ? (
          <MdOutlineCheckBox
            color={iconColor}
            className={classNames([{ "mr-2": value }, "toggle-check"])}
          />
        ) : (
          <MdOutlineCheckBoxOutlineBlank
            color={iconColor}
            className={classNames([{ "mr-2": value }, "toggle-check"])}
          />
        )}
        {value}
      </label>
    </div>
  );
};

export default Checkbox;
