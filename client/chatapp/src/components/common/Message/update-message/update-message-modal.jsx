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
import Input from "../../../common/Input/input";

export default function UpdateMessageModal({
  message,
  showState,
  updateMessageMutation,
}) {
  const [newMessage, setNewMessage] = useState(message.message || "");
  const [show, setShow] = showState;

  const update = () => {
    if (newMessage !== message.message) {
      updateMessageMutation.mutate({ id: message.id, message: newMessage });
    }
    setShow(false);
  };

  const resetModal = () => {
    setNewMessage(message.message);
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  return (
    <Modal show={show}>
      <ModalHeader>Update Message</ModalHeader>
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
