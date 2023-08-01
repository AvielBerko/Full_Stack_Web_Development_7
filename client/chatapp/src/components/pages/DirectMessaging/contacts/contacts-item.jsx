import React, { useState } from "react";
import {
  ListGroupItem,
  Card,
  Dropdown,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContact } from "../../../../api/contacts";
import UpdateContactModal from "./update-contact/update-contact-modal";

export default function ContactsItem({
  contact,
  user,
  selectedContact,
  setSelectedContact,
  setAlert,
}) {
  if (!contact) return <></>;
  const selected = selectedContact === contact.user_id;


  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);
  const queryClient = useQueryClient();

  const deleteContactMutation = useMutation({
    mutationFn: () => deleteContact(contact.id, user.token),
    onSuccess: (results) => {
      queryClient.invalidateQueries(["contacts", user.id]);
      setSelectedContact(null);
    },
    onError: (error) => {
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
    <>
      {updateContactModalDOM}
      <ListGroupItem>
        <div
          onClick={() => {
            setSelectedContact(contact.user_id);
          }}
        >
          <Card
            style={{
              border: selected ? "2px solid #007bff" : "1px solid #ced4da",
              borderRadius: "8px",
            }}
          >
            <Card.Body>
              <Card.Title
                className="d-flex justify-content-between"
                style={{ fontWeight: selected ? "bold" : "normal" }}
              >
                {contact.name}
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    <i className="fas fa-ellipsis-v"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => setShowUpdateContactModal(true)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Title>
              <Card.Text style={{ fontSize: "12.5px" }}>
                {contact.email}
              </Card.Text>
              <Card.Text style={{ fontSize: "12.5px" }}>
                {contact.phone_number}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </ListGroupItem>
    </>
  );
}
