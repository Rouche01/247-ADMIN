import classNames from "classnames";
import React from "react";

const TextArea = ({ name, value, handleChange, errorText }) => {
  return (
    <>
      <textarea
        className={classNames([
          "bg-transparent",
          "border-2",
          "w-full",
          "rounded-md",
          "px-6",
          "py-4",
          "text-white",
          "text-lg",
          "focus:outline-none",
          { "border-247-dark-text": !!!errorText },
          { "border-247-error-text": !!errorText },
          "outline-none",
        ])}
        placeholder="Write a message..."
        name={name}
        id={name}
        rows="10"
        value={value}
        onChange={handleChange}
      />
      {errorText && (
        <p className="text-sm mt-1 ml-2 text-247-error-text">{errorText}</p>
      )}
    </>
  );
};

export default TextArea;
