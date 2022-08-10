import React from "react";
import Spinner from "./Spinner";

const Button = ({
  children,
  type,
  className,
  fullWidth,
  isLoading,
  handleClick,
}) => {
  return (
    <button
      className={[
        "text-white",
        "py-3",
        "rounded-md",
        fullWidth && "w-full",
        "text-lg",
        "font-bold",
        "font-customRoboto",
        ...className,
      ].join(" ")}
      type={type}
      onClick={handleClick}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
