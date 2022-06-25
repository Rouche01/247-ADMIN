import classNames from "classnames";
import AsyncCreatableSelect from "react-select/async-creatable";
import { MdOutlineCheck } from "react-icons/md";

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
        "px-2",
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
  handleChange,
  darkMode,
  errorText,
  placeholderText,
  value,
  loadOptionFn,
  createNewOption,
  getOptionLabel,
  getOptionValue,
  loading,
  disabled,
  inputValue,
  onInputValueChange,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor:
        state.selectProps.darkMode && state.isDisabled
          ? "rgba(0, 0, 0, 0.1)"
          : state.selectProps.darkMode && !state.isDisabled
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
      color: state.isDisabled ? "rgba(255, 255, 255, 0.5)" : "#fff",
    }),
    menu: (provided, state) => ({
      ...provided,
      fontWeight: "500",
      backgroundColor: state.selectProps.darkMode ? "#222222" : bgColor,
      color: "#fff",
    }),
  };

  return (
    <div className={classNames({ "mt-8": !standAlone })}>
      {label && (
        <label className="inline-block text-white mb-2 font-medium">
          {label}
        </label>
      )}
      <AsyncCreatableSelect
        value={value}
        inputValue={inputValue}
        styles={customStyles}
        darkMode={darkMode}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        components={{
          Option: CustomOption,
        }}
        cacheOptions
        defaultOptions
        loadOptions={loadOptionFn}
        isSearchable
        onChange={handleChange}
        onInputChange={onInputValueChange}
        onCreateOption={createNewOption}
        isClearable
        placeholder={placeholderText}
        isLoading={loading}
        isDisabled={loading || disabled}
        maxMenuHeight={180}
      />
      {errorText && (
        <p className="text-sm mt-1 ml-2 text-247-error-text">{errorText}</p>
      )}
    </div>
  );
};

export default AsyncSelectInput;
