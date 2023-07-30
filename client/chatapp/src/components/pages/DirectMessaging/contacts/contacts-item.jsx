import React, { useState } from "react";
import { ListGroupItem, Card, Button, ListGroup } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContact } from "../../../../api/contacts";
import { createPortal } from "react-dom";
import UpdateContactModal from "./update-contact/update-contact-modal";
import { useContextMenu } from "../../../../custom-hooks/use-context-menu"; // Import the custom hook
import ContextMenu from "../../../common/ContextMenu/context-menu";

export default function ContactsItem({
  contact,
  user,
  selectedContact,
  setSelectedContact,
  setAlert,
}) {
  if (!contact) return <></>;

  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);

  const {
    isContextMenuOpen,
    contextMenuPosition,
    contextMenuRef,
    openContextMenu,
    closeContextMenu,
  } = useContextMenu(); // Use the custom hook

  const handleContextMenu = (event) => {
    openContextMenu(event);

    // Trigger the click event programmatically (simulating a regular click)
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0, // 0 for left click, 1 for middle click, 2 for right click
    });
    event.currentTarget.dispatchEvent(clickEvent);
  };
  const queryClient = useQueryClient();

  const selected = selectedContact === contact.user_id;

  const deleteContactMutation = useMutation({
    mutationFn: () => deleteContact(contact.id),
    onSuccess: (results) => {
      queryClient.invalidateQueries(["contacts"]);
    },
    onError: (error) => {
      //setAlert("An unexpected error occurred. Please try again later.");
      setAlert(error.message);
    },
  });

  const handleDelete = () => {
    deleteContactMutation.mutate();
  };

  const updateContactModalDOM = (
    <UpdateContactModal
      contact={contact}
      user={user}
      showState={[showUpdateContactModal, setShowUpdateContactModal]}
      setAlert={setAlert}
    />
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
      {isContextMenuOpen &&
        createPortal(
          <ContextMenu
            contextMenuRef={contextMenuRef}
            contextMenuPosition={contextMenuPosition}
            onClose={closeContextMenu}
            options={[
              { Edit: () => setShowUpdateContactModal(true) },
              { Delete: handleDelete },
            ]}
          />,
          document.body
        )}
    </div>
  );
}
