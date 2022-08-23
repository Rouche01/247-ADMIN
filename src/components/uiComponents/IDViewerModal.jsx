import React from "react";
import CenterModal from "./CenterModal";

const IDViewerModal = ({ open, setOpen, idUrl }) => {
  return (
    <CenterModal modalOpen={open} setModalOpen={setOpen}>
      <img src={idUrl} alt="driver identity document" />
    </CenterModal>
  );
};

export default IDViewerModal;
