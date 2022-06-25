import React from "react";
import Spinner from "./Spinner";

const RoundedBtnWithIcon = ({ onBtnClick, title, icon, isLoading }) => {
  return (
    <button
      onClick={onBtnClick}
      className="text-base text-white bg-247-red-shade px-5 py-3 rounded-full flex items-center justify-center"
      style={{ minWidth: "160px" }}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {icon}
          {title}
        </>
      )}
    </button>
  );
};

export default RoundedBtnWithIcon;
