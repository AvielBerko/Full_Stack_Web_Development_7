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
import { addContact } from "../../../../../api/contacts";
import { getUsers } from "../../../../../api/users";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function AddContactModal({
  user,
  showState,
  setFatherAlert,
  contacts,
  refetchContacts,
}) {
  const [name, setName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

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

  const addContactMutation = useMutation({
    mutationFn: (contact) => addContact(contact, user.token),
    onSuccess: (results) => {
        refetchContacts();
        setShow(false);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const create = () => {
    if (!name) {
      setAlert("Please write a name.");
      return;
    }
    if (!selectedUser) {
      setAlert("Please select a user.");
      return;
    }
    addContactMutation.mutate({
      name,
      user_id: selectedUser,
    });
  };

  const resetModal = () => {
    setName("");
    setAlert("");
    setSelectedUser(null);
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  if (usersQuery.isLoading) return <></>;
  //if (usersQuery.isError) return <>Error: {error.message}</>;
  if (!usersQuery?.data?.length) return <>No data</>;
  // add a filter to remove the users that are already contacts
  // filter also the current user
  const usersDOM = usersQuery?.data
    ?.filter((u) => {
      // filter the current user
      if (u.id === user.id) return false;
      // filter the users that are already contacts
      return !contacts.some((contact) => contact.user_id === u.id);
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
        <FormLabel><h4>Contacts Name:</h4></FormLabel>
        <InputGroup>
          <FormControl
            placeholder="Write here the Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {usersDOM}
        </div>

      </ModalBody>
      <ModalFooter>
        <Button
          disabled={selectedUser == null || name === ""}
          variant={selectedUser != null && name != "" ? "primary" : "dark"}
          onClick={create}
        >
          Add Contact
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
