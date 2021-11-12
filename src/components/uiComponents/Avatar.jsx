import React from "react";
import { FaUser } from "react-icons/fa";

const Avatar = () => {
  return (
    <div className="h-12 w-12 rounded-full bg-247-gray flex items-center justify-center border-2 border-247-dark-text cursor-pointer">
      <FaUser color="#212427" />
    </div>
  );
};

export default Avatar;
