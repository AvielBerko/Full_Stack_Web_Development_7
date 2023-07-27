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
    mutationFn: (
      async (group) => {
        try {
          const addedGroup = await addGroup(group);

          await joinGroup(addedGroup.id, {user_id: user.id });
          return addedGroup;
        } catch (error) {
          // Handle errors if needed
          throw new Error(error.message);
        }
      }),
      // addGroup(group).then((group) =>
      //   joinGroup({ groupchat_id: group.id, user_id: user.id })    );
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
        <Alert variant="danger" onAbort={() => setAlert("")} dismissible>
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
          variant={name === "" ? "success" : "dark"}
          onClick={create}
        >
          Create
        </Button>
        <Button variant="danger" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
