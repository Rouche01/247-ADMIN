import React from "react";

const RoundedBtnWithIcon = ({ onBtnClick, title, icon }) => {
  return (
    <button
      onClick={onBtnClick}
      className="text-base text-white bg-247-red-shade px-5 py-3 rounded-full flex items-center"
    >
      {icon}
      {title}
    </button>
  );
};

export default RoundedBtnWithIcon;
