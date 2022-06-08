import React from "react";
import { VscSearchStop } from "react-icons/vsc";

const NoDataBox = ({ title, subtitle }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center">
        <VscSearchStop size={60} color="#d1d1d1" />
        <h4 className="text-white font-semibold text-2xl mt-5">{title}</h4>
        <p className="mt-2 text-gray-300">{subtitle}</p>
      </div>
    </div>
  );
};

export default NoDataBox;
