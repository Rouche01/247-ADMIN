import React from "react";

const Button = ({ children, type, className }) => {
  return (
    <button
      className={[
        ...className,
        "bg-247-main",
        "text-white",
        "w-full",
        "py-4",
        "rounded-md",
        "text-lg",
        "font-bold",
        "font-customRoboto",
      ].join(" ")}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
