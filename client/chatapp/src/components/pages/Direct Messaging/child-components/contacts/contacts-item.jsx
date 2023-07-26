import React, { useState, useEffect, useRef } from "react";
import { ListGroupItem, Card, Button, ListGroup } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContact } from "../../../../../api/contacts";
import { createPortal } from "react-dom";
import UpdateContactModal from "./update-contact/update-contact-modal";

export default function ContactsItem({
  contact,
  selectedContact,
  setSelectedContact,
}) {
  if (!contact) return <></>;

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);
  const contextMenuRef = useRef(null);

  const queryClient = useQueryClient();

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setIsContextMenuOpen(true);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isContextMenuOpen &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setIsContextMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isContextMenuOpen]);

  const selected = selectedContact === contact.user_id;

  const deleteContactMutation = useMutation({
    mutationFn: () => deleteContact(contact.id),
    onSuccess: (results) => {
      if (results === "") {
        // update the cache and remove the deleted contact

        queryClient.invalidateQueries(["contacts"]);
      } else {
        setAlert(results);
      }
    },
    onError: () => {
      setAlert("An unexpected error occurred. Please try again later.");
    },
  });

  const handleDelete = () => {
    deleteContactMutation.mutate();
  };

  const contextMenu = (
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
        zIndex: 9999, // Set a high z-index value to place it on top
      }}
      onClick={() => setIsContextMenuOpen(false)}
    >
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex">
          <Button
            variant="success"
            className="flex-grow-1"
            onClick={() => setShowUpdateContactModal(true)}
          >
            Edit
          </Button>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex">
          <Button
            variant="danger"
            className="flex-grow-1"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );

  const updateContactModalDOM = (
    <ListGroupItem>
      <UpdateContactModal
        contact={contact}
        showState={[showUpdateContactModal, setShowUpdateContactModal]}
      />
    </ListGroupItem>
  );

  return (
    <div onContextMenu={handleContextMenu}>
      {updateContactModalDOM}
      <ListGroupItem>
        <div
          onClick={() => {
            setSelectedContact(contact.user_id);
          }}
        >
          <Card>
            <Card.Body>
              <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
                {contact.name}
              </Card.Title>
              <Card.Text style={{ fontSize: "12.5px" }}>
                Number: {contact.phone_number}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </ListGroupItem>
      {isContextMenuOpen && createPortal(contextMenu, document.body)}
    </div>
  );
}
