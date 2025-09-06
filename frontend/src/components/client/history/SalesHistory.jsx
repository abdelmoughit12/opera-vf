import React, { useState } from "react";
import HistoryManagementModal from "./HistoryManagementModal";

const SalesHistory = ({ client, onClose }) => {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    onClose?.();
  };

  return (
    <>
      {showModal && (
        <HistoryManagementModal client={client} onClose={handleClose} />
      )}
    </>
  );
};

export default SalesHistory;
