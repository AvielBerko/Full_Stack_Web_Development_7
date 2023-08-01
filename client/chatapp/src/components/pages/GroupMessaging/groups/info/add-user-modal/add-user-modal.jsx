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
import UserItem from "./user-item";
import { joinGroup } from "../../../../../../api/groups";
import { getUsers } from "../../../../../../api/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddUserModal({
  user,
  group_id,
  showState,
  setFatherAlert,
  members,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    enabled: show,
    queryFn: () => {
      return getUsers(user.token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setFatherAlert(error.message); // TODO set the alert of the father!!!
    }
  });

  const joinUserMutation = useMutation({
    mutationFn: () => joinGroup(group_id, {user_id: selectedUser}, user.token),
    onSuccess: (results) => {
      queryClient.invalidateQueries("groups", group_id, "members");
      setShow(false);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const join = () => {
    if (!selectedUser) {
      setAlert("Please select a user.");
      return;
    }
    joinUserMutation.mutate();
  };

  const resetModal = () => {
    setAlert("");
    setSelectedUser(null);
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  if (usersQuery.isLoading) return <></>;
  //if (usersQuery.isError) return <>Error: {error.message}</>;
  if (!usersQuery?.data?.length) return <>No data</>;
  // add a filter to remove the users that are already member
  // filter also the current user
  const usersDOM = usersQuery?.data
    ?.filter((u) => {
      // filter the current user
      if (u.id === user.id) return false;
      // filter the users that are already member
      return !members?.some((member) => member.user_id === u.id);
    })
    .map((user) => {
      return (
        <UserItem
          key={user.id}
          user={user}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
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
            <h3>Add Contact</h3>
          </Col>
        </Row>
        <Row>
          <Col>{alert && alertDOM}</Col>
        </Row>
      </Container>{" "}
      <ModalBody>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {usersDOM}
        </div>

      </ModalBody>
      <ModalFooter>
        <Button
          disabled={selectedUser == null}
          variant={selectedUser != null ? "primary" : "dark"}
          onClick={join}
        >
          Add
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}