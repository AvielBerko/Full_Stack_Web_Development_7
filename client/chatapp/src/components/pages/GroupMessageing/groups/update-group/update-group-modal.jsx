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
import { useQueryClient } from "@tanstack/react-query";
import EdibaleLabel from "../../../../common/edibaleLabel/edibale-label";
import { updateGroup } from "../../../../../api/groups";
import { useMutation } from "@tanstack/react-query";

export default function UpdateGroupModal({ group, user, showState }) {
  const [newName, setNewName] = useState(group.name || "");
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const queryClient = useQueryClient();
  const updateGroupMutetion = useMutation({
    mutationFn: (group) => updateGroup(group),
    onSuccess: (results) => {
      queryClient.setQueryData(["groups", user.id], (oldData) => {
        const newData = oldData.map((group) => {
          if (group.id === results.id) {
            return { ...group, ...results };
          } else {
            return group;
          }
        });
        return newData;
      });
//      queryClient.invalidateQueries(["groups", user.id])
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
    if (newName !== group.name)
      updateGroupMutetion.mutate({ id: group.id, name: newName });
    else resetModal();
    //setShow(false);
  };

  const resetModal = () => {
    setNewName(group.name || "");
    setAlert("");
    setShow(false);
  };

  useEffect(() => {
    resetModal();
  }, [group]);

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
              <h3>Update Group</h3>
            </Col>
          </Row>
          <Row>
            <Col>{alert && alertDOM}</Col>
          </Row>
        </Container>
      </ModalHeader>
      <ModalBody>
        <Card>
          <Card.Body>
            <EdibaleLabel
              isEditable={true}
              label="Group Name"
              setter={setNewName}
              value={newName}
              WrapperComponent={Card.Title}
            />
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
