import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Alert,
  Container,
} from "react-bootstrap";
import EdibaleLabel from "../../../../common/edibaleLabel/edibale-label";
import AlertComponent from "../../../../common/AlertComponent/alert-component";
import { updateContact } from "../../../../../api/contacts";
import { useQueryClient, useMutation } from "@tanstack/react-query";


export default function UpdateContactModal({ contact, user, showState }) {
  const [newName, setNewName] = useState(contact.name || "");
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;
  const queryClient = useQueryClient();

  const updateContactMutetion = useMutation({
    mutationFn: (contact) => updateContact(contact, user.token),
    onSuccess: (results) => {
      queryClient.setQueriesData(["contacts", user.id], (oldData) => {
        const newData = oldData.map((contact) => {
          if (contact.id === results.id) {
            return { ...contact, ...results };
          }
          return contact;
        });
        return newData;
      });
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const update = () => {
    if (!newName) {
      setAlert("Please write a name.");
      return;
    }
    if (newName !== contact.name)
      updateContactMutetion.mutate({ id: contact.id, name: newName });
    else resetModal();
  };

  const resetModal = () => {
    setNewName(contact.name || "");
    setAlert("");
    setShow(false);
  };

  useEffect(() => {
    resetModal();
  }, [contact]);

  return (
    <Modal show={show}>
      <ModalHeader>
        <Container fluid>
          <Row className="text-center">
            <Col>
              <h3>Update Contact</h3>
            </Col>
          </Row>
          <Row>
            <Col> {alert && <AlertComponent alert={alert} setAlert={setAlert} />}</Col>
          </Row>
        </Container>
      </ModalHeader>
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
          variant={newName != "" ? "primary" : "dark"}
          onClick={update}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={resetModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
