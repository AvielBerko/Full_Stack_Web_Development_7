import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Alert,
  Container,
} from "react-bootstrap";
import { addGroup, joinGroup } from "../../../../../api/groups";
import { useMutation } from "@tanstack/react-query";

export default function AddGroupModal({ user, showState, refetchGroups }) {
  const [name, setName] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const addGroupMutation = useMutation({
    mutationFn: (group) => addGroup(group, user.token),
    onSuccess: (results) => {
      refetchGroups();
      setShow(false);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const create = () => {
    addGroupMutation.mutate({
      name,
      time_created: new Date(),
    });
  };

  const resetModal = () => {
    setName("");
    setAlert("");
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  const alertDOM = (
    <Row>
      <Col>
        <Alert variant="danger" onClose={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  return (
    <Modal show={show}>
      <Container fluid>
        <Row className="text-center">
          <Col>
            <h3>New Group</h3>
          </Col>
        </Row>
        <Row>
          <Col>{alert && alertDOM}</Col>
        </Row>
      </Container>{" "}
      <ModalBody>
        <FormLabel><h4>Group Name:</h4></FormLabel>
          <InputGroup>
            <FormControl
              placeholder="Write here the Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={name === ""}
          variant={name !== "" ? "primary" : "dark"}
          onClick={create}
        >
          Create
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
