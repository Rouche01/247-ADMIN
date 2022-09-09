import React from "react";
import classNames from "classnames/bind";

const InputField = (props) => {
  const {
    inputIcon,
    registerFn,
    errorText,
    label,
    darkMode,
    isNumeric,
    setValue,
    ...inputProps
  } = props;

  const registerFunction = () =>
    isNumeric
      ? registerFn(props.name, {
          onChange: (e) => {
            const value = parseFloat(
              e.target.value.replace(/\D/g, "").replace(/,/g, "")
            );

            value
              ? setValue(props.name, value.toLocaleString())
              : setValue(props.name, "");
          },
        })
      : registerFn(props.name);

  return (
    <div>
      <div className="relative mt-8">
        {label && (
          <label className="text-base mb-2 font-medium inline-block text-white">
            {label}
          </label>
        )}
        <input
          {...inputProps}
          {...registerFunction()}
          className={classNames(
            "w-full",
            "px-5",
            "py-3",
            "border",
            { "border-247-dark-text": !!!errorText },
            { "border-247-error-text": !!errorText },
            "rounded-md",
            "text-lg",
            { "bg-247-dark-mode-input-bg": darkMode },
            "font-customRoboto",
            { "text-white": darkMode && !inputProps.disabled },
            { "text-247-disabled-input": darkMode && inputProps.disabled },
            { "cursor-not-allowed": inputProps.disabled },
            "outline-none"
          )}
        />
        <span className="absolute top-1/4 right-5">
          {inputIcon && inputIcon}
        </span>
      </div>
      {errorText && (
        <p className="text-sm mt-1 ml-2 text-247-error-text">{errorText}</p>
      )}
    </div>
  );
};

export default InputField;
