import classNames from "classnames";
import React from "react";

const Spinner = ({ size = "small" }) => {
  return (
    <div className="w-full flex justify-center">
      <div
        className={classNames(
          { "w-6": size === "small" },
          { "h-6": size === "small" },
          { "w-12": size === "large" },
          { "h-12": size === "large" },
          "border-247-transparent",
          "rounded-full",
          "border-t-2",
          "border-b-2",
          "animate-spin"
        )}
      ></div>
    </div>
  );
};

export default Spinner;
