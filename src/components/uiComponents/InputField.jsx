import React from "react";
import classNames from "classnames/bind";

const InputField = (props) => {
  const { inputIcon, registerFn, errorText, ...inputProps } = props;

  return (
    <>
      <div className="relative mt-8">
        <input
          {...inputProps}
          {...registerFn(props.name)}
          className={classNames(
            "w-full",
            "px-5",
            "py-3",
            "border",
            { "border-247-dark-text": !!!errorText },
            { "border-247-error-text": !!errorText },
            "rounded-md",
            "text-lg",
            "font-customRoboto"
          )}
        />
        <span className="absolute top-1/4 right-5">
          {inputIcon && inputIcon}
        </span>
      </div>
      {errorText && (
        <p className="text-sm mt-1 ml-2 text-247-error-text">{errorText}</p>
      )}
    </>
  );
};

export default InputField;
