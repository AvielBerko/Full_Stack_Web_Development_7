import React from "react";
import { createPortal } from "react-dom";
import { ListGroup, Button } from "react-bootstrap";

const ContextMenu = ({ contextMenuRef, contextMenuPosition, onClose, onEdit, onDelete }) => {
  const handleEdit = () => {
    onClose();
    onEdit();
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <div
      ref={contextMenuRef}
      style={{
        position: "fixed",
        top: contextMenuPosition.y,
        left: contextMenuPosition.x,
        backgroundColor: "white",
        boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
        padding: "4px",
        borderRadius: "4px",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex">
          <Button variant="success" className="flex-grow-1" onClick={handleEdit}>
            Edit
          </Button>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex">
          <Button variant="danger" className="flex-grow-1" onClick={handleDelete}>
            Delete
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default ContextMenu;
