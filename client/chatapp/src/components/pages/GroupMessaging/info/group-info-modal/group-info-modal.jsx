import React, { useEffect, useState } from "react";
import {
  Button,

  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Alert,
  Container,
} from "react-bootstrap";
import GroupInfoUser from "./group-info-user";

export default function GroupInfoModal({
  user,
  group,
  groupMembersQuery,
  showState,
}) {

  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const admin = groupMembersQuery?.data?.find((member) => {
    return member.user_id === user.id && member.admin;
  });

  const resetModal = () => {
    setAlert("");
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  const membersDOM = groupMembersQuery?.data?.map((member) => {
      return (
        <GroupInfoUser key={member.id} user={{...user, admin}} member={member} setAlert={setAlert} />
      );
    });

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
            <h3>Group Info</h3>
          </Col>
        </Row>
        <Row>
          <Col>{alert && alertDOM}</Col>
        </Row>
      </Container>{" "}
      <ModalBody>
        <div style={{ maxHeight: "520px", overflowY: "auto" }}>
          {membersDOM}
        </div>
      </ModalBody>
        <ModalFooter>
            {admin && (
              <Button
                variant="success"
                onClick={() => {
                  //add user
                }
              }
              >
                Add User
              </Button>)}                
            <Button variant="danger" onClick={() => setShow(false)}>
                Close
            </Button>
        </ModalFooter>
    </Modal>
  );
}
