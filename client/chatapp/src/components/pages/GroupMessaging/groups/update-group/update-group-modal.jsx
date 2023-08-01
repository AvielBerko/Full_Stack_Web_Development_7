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
import AlertComponent from "../../../../common/AlertComponent/alert-component";

export default function UpdateGroupModal({ group, user, showState }) {
  const [newName, setNewName] = useState(group.name || "");
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const queryClient = useQueryClient();
  const updateGroupMutetion = useMutation({
    mutationFn: (group) => updateGroup(group, user.token),
    onSuccess: (results) => {
      queryClient.setQueryData(["groups", "user_id", user.id], (oldData) => {
        const newData = oldData.map((group) => {
          if (group.id === results.id) {
            return { ...group, ...results };
          } else {
            return group;
          }
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
    if (newName !== group.name)
      updateGroupMutetion.mutate({ id: group.id, name: newName });
    else resetModal();
  };

  const resetModal = () => {
    setNewName(group.name || "");
    setAlert("");
    setShow(false);
  };

  useEffect(() => {
    resetModal();
  }, [group]);

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
            <Col>
              {alert && <AlertComponent alert={alert} setAlert={setAlert} />}
            </Col>
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
