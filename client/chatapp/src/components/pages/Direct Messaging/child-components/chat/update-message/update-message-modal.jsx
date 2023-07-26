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
import { updateMessage } from "../../../../../../api/direct_messaging";
import { useMutation } from "@tanstack/react-query";
import Input from "../../../../../common/Input/input";

export default function UpdateMessageModal({ message, showState }) {
  const [newMessage, setNewMessage] = useState(message.message || "");
  const [show, setShow] = showState;

  const queryClient = useQueryClient();

  const updateMessageMutetion = useMutation({
    mutationFn: (message) => updateMessage(message),
    onSettled: (results) => {
      if (typeof results === "string") {
        setAlert(results);
      } else {
        queryClient.invalidateQueries(["messages"])
      }
    },
    onError: (error) => {
      setAlert("An unexpected error occurred. Please try again later.");
    },
  });

  const update = () => {
    if (!newMessage) {
      window.alert("Please write a message.");
      return;
    }
    updateMessageMutetion.mutate({ id: message.id, message: newMessage });
    setShow(false);
  };

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
