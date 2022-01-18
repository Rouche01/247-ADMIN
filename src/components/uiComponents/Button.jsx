import React from "react";
import Spinner from "./Spinner";

const Button = ({ children, type, className, fullWidth, isLoading }) => {
  return (
    <button
      className={[
        ...className,
        "text-white",
        "py-4",
        "rounded-md",
        fullWidth && "w-full",
        "text-lg",
        "font-bold",
        "font-customRoboto",
      ].join(" ")}
      type={type}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
