import React from "react";
import Spinner from "./Spinner";

const Button = ({
  children,
  type,
  className,
  fullWidth,
  isLoading,
  handleClick,
  ...props
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
        "disabled:bg-247-inactive-btn",
        "disabled:text-247-gray-accent5",
        "disabled:cursor-not-allowed",
        ...className,
      ].join(" ")}
      type={type}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
