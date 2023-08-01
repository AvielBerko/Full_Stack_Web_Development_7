import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export default function ImageMessage({ src }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <img
        src={src}
        onClick={handleImageClick}
        style={{ maxWidth: "100%", maxHeight: "200px", cursor: "pointer" }}
      />
      <Modal show={isModalOpen} onHide={handleCloseModal} centered>
        <Modal.Body>
          <img src={src} alt="Full Screen" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
