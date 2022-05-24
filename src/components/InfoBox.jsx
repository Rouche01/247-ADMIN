import React from "react";
import { MdOutlineArrowUpward, MdOutlineArrowDownward } from "react-icons/md";

const InfoBox = ({ infoTitle, infoValue, bgColor, statChange }) => {
  return (
    <div className={`${bgColor} rounded-md border-2 border-247-dark-text p-7`}>
      <h4 className="text-white font-customRoboto font-medium text-lg">
        {infoTitle}
      </h4>
      <div className="mt-4 flex items-center relative">
        <h2 className="font-customRoboto text-white text-3xl font-medium">
          {infoValue}
        </h2>
        {statChange > 0 ? (
          <MdOutlineArrowUpward
            className="absolute left-48 text-247-increment-green"
            size={40}
          />
        ) : (
          <MdOutlineArrowDownward
            className="absolute left-48 text-247-decrement-red"
            size={40}
          />
        )}
      </div>
    </div>
  );
};

export default InfoBox;
