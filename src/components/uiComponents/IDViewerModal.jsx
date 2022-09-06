import React from "react";
import CenterModal from "./CenterModal";

const IDViewerModal = ({ open, setOpen, idUrl }) => {
  return (
    <CenterModal modalOpen={open} setModalOpen={setOpen}>
      {idUrl ? (
        <img src={idUrl} alt="driver identity document" />
      ) : (
        <h2 className="text-247-transparent text-xl text-center font-bold">
          No ID Document was provided
        </h2>
      )}
    </CenterModal>
  );
};

export default IDViewerModal;
