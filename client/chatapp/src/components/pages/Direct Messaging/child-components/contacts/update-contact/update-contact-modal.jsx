import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import EdibaleLabel from "../../../../../common/edibaleLabel/edibale-label";
import { updateContact } from "../../../../../../api/contacts";
import { useMutation } from "@tanstack/react-query";

export default function UpdateContactModal({ contact, showState }) {
  const [newName, setNewName] = useState(contact.name || "");
  const [show, setShow] = showState;

  const queryClient = useQueryClient();
  const updateContactMutetion = useMutation({
    mutationFn: (contact) => updateContact(contact),
    onSettled: (results) => {
      if (typeof results === "string") {
        setAlert(results);
      } else {
        //contactsQuery.refetch();
        queryClient.setQueriesData(["contacts"], (oldData) => {
          const newData = oldData.pages.map((page) => {
            return page.map((contact) => {
              if (contact.id === results.id) {
                return { ...contact, ...results };
              }
              return contact;
            });
          });
          return { pages: newData };
        });
        //queryClient.invalidateQueries(["contacts"])
      }
    },
    onError: (error) => {
      setAlert("An unexpected error occurred. Please try again later.");
    },
  });

  const update = () => {
    if (!newName) {
      window.alert("Please write a name.");
      return;
    }
    updateContactMutetion.mutate({ id: contact.id, name: newName });
    setShow(false);
  };

  return (
    <Modal show={show}>
      <ModalHeader>Update Contact</ModalHeader>
      <ModalBody>
        <Card>
          <Card.Body>
            <EdibaleLabel
              isEditable={true}
              label="Name"
              setter={setNewName}
              value={newName}
              WrapperComponent={Card.Title}
            />
              <Card.Text>Email: {contact.email}</Card.Text>
              <Card.Text>Phone Number: {contact.phone_number}</Card.Text>
          </Card.Body>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={newName === ""}
          variant={newName != "" ? "success" : "dark"}
          onClick={update}
        >
          Save
        </Button>
        <Button variant="danger" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
