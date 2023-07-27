import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row, Col, Alert, Container
} from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import EdibaleLabel from "../../../../common/edibaleLabel/edibale-label";
import { updateContact } from "../../../../../api/contacts";
import { useMutation } from "@tanstack/react-query";

export default function UpdateContactModal({ contact, showState }) {
  const [newName, setNewName] = useState(contact.name || "");
  const [alert, setAlert] = useState("");
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
    else
      resetModal();
    //setShow(false);
  };

  const resetModal = () => {
    setNewName(contact.name || "");
    setAlert("");
    setShow(false);
  };

  useEffect(() => {
    resetModal();
  }, [contact]);


  const alertDOM = (
    <Row>
      <Col>
        <Alert variant="danger" onAbort={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

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
          <Col>
            {alert && alertDOM}
          </Col>
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
          variant={newName != "" ? "success" : "dark"}
          onClick={update}
        >
          Save
        </Button>
        <Button variant="danger" onClick={resetModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
