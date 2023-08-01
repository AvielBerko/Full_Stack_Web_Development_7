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
import AddUserModal from "../add-user-modal/add-user-modal";

export default function GroupInfoModal({
  user,
  group_id,
  groupMembersQuery,
  showState,
}) {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
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
      <GroupInfoUser
        key={member.id}
        user={{ ...user, admin }}
        member={member}
        setAlert={setAlert}
      />
    );
  });

  const addUserModalDOM = (
    <AddUserModal
      user={user}
      group_id={group_id}
      showState={[showAddUserModal, setShowAddUserModal]}
      setFatherAlert={setAlert}
      members={groupMembersQuery?.data}
    />
  );

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
    <>
      {addUserModalDOM}
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
          <div style={{ maxHeight: "430px", overflowY: "auto" }}>
            {membersDOM}
          </div>
        </ModalBody>
        <ModalFooter>
          {admin && (
            <Button
              variant="primary"
              onClick={() => {
                setShowAddUserModal(true);
              }}
            >
              Add User
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
