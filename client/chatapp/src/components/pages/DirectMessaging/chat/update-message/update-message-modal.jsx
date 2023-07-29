import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessage } from "../../../../../api/dmessges";
import { useMutation } from "@tanstack/react-query";
import Input from "../../../../common/Input/input";

export default function UpdateMessageModal({ message, showState }) {
  const [newMessage, setNewMessage] = useState(message.message || "");
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const contactID = message.receiver_id;

  const queryClient = useQueryClient();
  
  const updateMessageMutetion = useMutation({
    mutationFn: (message) => updateMessage(contactID, message),
    onSuccess: (results) => {
        queryClient.invalidateQueries(["messages"]);
        setShow(false);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const update = () => {
    if (newMessage !== message.message)
      updateMessageMutetion.mutate({ id: message.id, message: newMessage });
    else
      setShow(false);
  };

  const resetModal = () => {
    setNewMessage(message.message);
    setAlert("");
  };

  useEffect(() => {
    resetModal();
  }, [show]);

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
      <ModalHeader>Update Message</ModalHeader>
      {alert && alertDOM}
      <ModalBody>
        <Card>
          <Card.Body>
            <Card.Title>New Message:</Card.Title>
              <Input inputType="text" value={newMessage} setter={setNewMessage} />
          </Card.Body>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={newMessage === ""}
          variant={newMessage != "" ? "success" : "dark"}
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
