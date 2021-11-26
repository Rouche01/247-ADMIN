import React from "react";

const ColorTag = ({ color, tagName, tagValue }) => {
  return (
    <div className="flex items-center">
      {color && <div className={`w-3 h-3 mr-2 ${color}`}></div>}
      <p className="text-247-gray-accent2 font-medium">
        <span className="font-bold">{tagName}</span> {tagValue}
      </p>
    </div>
  );
};

export default ColorTag;
