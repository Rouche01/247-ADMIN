import React from "react";
import { MdAdd } from "react-icons/md";

const CreateCampaignBtn = ({ onBtnClick }) => {
  return (
    <button
      onClick={onBtnClick}
      className="text-base text-white bg-247-red-shade px-5 py-3 rounded-full flex items-center"
    >
      <MdAdd className="mr-2" size={22} />
      Create Campaign
    </button>
  );
};

export default CreateCampaignBtn;
