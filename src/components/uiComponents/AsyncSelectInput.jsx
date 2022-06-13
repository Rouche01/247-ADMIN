import React, { useCallback, useContext, useEffect } from "react";
import classNames from "classnames";
import AsyncSelect from "react-select/async";
import { MdOutlineCheck } from "react-icons/md";
import debounce from "lodash/debounce";
import { Context as AdvertiserContext } from "../../context/AdvertiserContext";

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

const AsyncSelectInput = ({
  label,
  standAlone,
  bgColor,
  borderColor,
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
      backgroundColor: state.selectProps.darkMode
        ? "rgba(0, 0, 0, 0.25)"
        : bgColor,
      borderColor: state.selectProps.darkMode ? "#4D4D4D" : borderColor,
      padding: "6px 10px",
      "&:hover": {
        borderColor: state.selectProps.darkMode ? "#4D4D4D" : borderColor,
      },
      "&:focus": {
        borderColor: state.selectProps.darkMode ? "#4D4D4D" : borderColor,
        boxShadow: "none",
      },
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
      backgroundColor: state.selectProps.darkMode ? "#222222" : bgColor,
      color: "#fff",
    }),
  };

  const {
    state: { filteringAdvertisers, filteredAdvertisers },
    filterAdvertisersByStartsWith,
  } = useContext(AdvertiserContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promiseOptions = useCallback(
    debounce(async (inputValue) => {
      console.log(inputValue);
      await filterAdvertisersByStartsWith(inputValue);
      return filteredAdvertisers.map((advertiser) => ({
        label: advertiser.companyName,
        value: advertiser.companyName.toLowerCase(),
      }));
    }, 1000),
    []
  );

  useEffect(() => console.log(filteredAdvertisers), [filteredAdvertisers]);

  return (
    <div className={classNames({ "mt-8": !standAlone })}>
      {label && (
        <label className="inline-block text-white mb-2 font-medium">
          {label}
        </label>
      )}
      <AsyncSelect
        styles={customStyles}
        darkMode={darkMode}
        components={{
          Option: CustomOption,
        }}
        cacheOptions={false}
        defaultOptions
        loadOptions={promiseOptions}
      />
    </div>
  );
};

export default AsyncSelectInput;
