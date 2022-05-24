import React from "react";
import DatePicker from "react-datepicker";
import { MdOutlineCalendarToday } from "react-icons/md";
import classNames from "classnames";

const DateInput = ({
  label,
  darkMode,
  placeholder,
  startDate,
  endDate,
  handleChange,
  errorText
}) => {
  return (
    <div className="mt-8">
      {label && (
        <label className="text-base mb-2 font-medium inline-block text-white">
          {label}
        </label>
      )}
      <div
        className={classNames("relative", "rounded-md", {
          "bg-247-dark-mode-input-bg": darkMode,
        })}
      >
        <DatePicker
          className={classNames("z-20", "w-full", "py-3")}
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => handleChange(update)}
          placeholderText={placeholder}
        />
        <MdOutlineCalendarToday
          className="absolute top-1/2 left-5 cursor-pointer z-0"
          style={{ transform: "translateY(-50%)" }}
          size={20}
          color="#DFDFDF"
        />
      </div>
      {errorText && (
        <p className="text-sm mt-1 ml-2 text-247-error-text">{errorText}</p>
      )}
    </div>
  );
};

export default DateInput;
