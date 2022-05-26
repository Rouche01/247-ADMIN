import React from "react";
import { MdOutlineArrowUpward, MdOutlineArrowDownward } from "react-icons/md";

const InfoBox = ({ infoTitle, infoValue, bgColor, statChange, btnText }) => {
  return (
    <div className={`${bgColor} rounded-lg border-2 border-247-dark-text p-7 flex-col justify-items-center items-center`}>
      <h4 className="text-white font-customRoboto font-medium text-xl">
        {infoTitle}
      </h4>
      <div className="mt-4 flex items-center relative">
        <h2 className="font-customRoboto text-white text-3xl font-medium">
          {infoValue}
        </h2>
        {statChange &&
          (statChange > 0 ? (
            <MdOutlineArrowUpward
              className="absolute left-48 text-247-increment-green"
              size={40}
            />
          ) : (
            <MdOutlineArrowDownward
              className="absolute left-48 text-247-decrement-red"
              size={40}
            />
          ))}
      </div>
      {btnText && (
        <button className="text-lg font-semibold px-7 py-2 bg-white rounded mt-4">
          {btnText}
        </button>
      )}
    </div>
  );
};

export default InfoBox;
