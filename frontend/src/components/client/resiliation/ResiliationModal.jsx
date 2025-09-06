import React from "react";

const ResiliationModal = ({ client, onClose }) => (
  <div>
    <h3>Résiliation</h3>
    {/* Formulaire de résiliation */}
    <button onClick={onClose}>Fermer</button>
  </div>
);

export default ResiliationModal;