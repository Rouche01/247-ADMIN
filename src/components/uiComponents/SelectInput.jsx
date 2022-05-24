import React from "react";
import Select from "react-select";
import { MdOutlineCheck } from "react-icons/md";
import classNames from "classnames";

const CustomOption = ({
  innerProps,
  cx,
  data,
  selectProps,
  isSelected,
  isFocused,
  ...props
}) => {
  return (
    <div
      className={classNames(
        "flex",
        "items-center",
        "px-3",
        "py-3",
        "cursor-pointer",
        "hover:bg-black",
        "hover:text-247-red-straight",
        { "bg-black": isSelected }
      )}
      data-focused={isFocused}
      data-selected={isSelected}
      {...innerProps}
      {...props}
    >
      <div className="w-5 h-5">
        {isSelected && <MdOutlineCheck size={20} />}
      </div>
      <label className="ml-3">{props.label}</label>
    </div>
  );
};

const SelectInput = ({
  label,
  options,
  value,
  darkMode,
  errorText,
  placeholderText,
  handleChange,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.selectProps.darkMode && "rgba(0, 0, 0, 0.25)",
      borderColor: state.selectProps.darkMode && "#4D4D4D",
      padding: "6px 10px",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: "1.125rem",
      fontWeight: "500",
      color: "#fff",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontWeight: "500",
      color: "#848b95",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontWeight: "500",
      color: "#fff",
    }),
    menu: (provided, state) => ({
      ...provided,
      fontWeight: "500",
      backgroundColor: state.selectProps.darkMode && "rgba(0, 0, 0, 0.25)",
      color: "#fff",
    }),
  };
  return (
    <div className="mt-8">
      {label && (
        <label className="inline-block text-white mb-2 font-medium">
          {label}
        </label>
      )}
      <Select
        className="react-select"
        options={options}
        placeholder={placeholderText}
        styles={customStyles}
        darkMode={darkMode}
        value={value}
        onChange={handleChange}
        components={{
          Option: CustomOption,
        }}
      />
    </div>
  );
};

export default SelectInput;
