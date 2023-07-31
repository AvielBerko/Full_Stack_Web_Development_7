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
import GroupItem from "./group-item";
import { joinGroup, getAllGroups } from "../../../../../api/groups";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function JoinGroupModal({
  user,
  showState,
  userGroups,
  refetchGroups,
}) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    enabled: show,
    queryFn: () => {
      return getAllGroups(user.token);
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: (groupID) => joinGroup(groupID, {user_id: user.id}, user.token),
    onSuccess: (results) => {
        refetchGroups();
        setShow(false);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const create = () => {
    if (!selectedGroup) {
      setAlert("Please select a group.");
      return;
    }
    joinGroupMutation.mutate(selectedGroup);
  };

  const resetModal = () => {
    setAlert("");
    setSelectedGroup(null);
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  if (groupsQuery.isLoading) return <></>;
  //if (groupsQuery.isError) return <>Error: {error.message}</>;
  if (!groupsQuery?.data?.length) return <>No data</>;
  // add a filter to remove the groups that are already groups
  // filter also the current group
  const groupsDOM = groupsQuery?.data.filter((group) => {
    // Check if the group's id is not present in the userGroups array
    return !userGroups.some((userGroup) => userGroup.id === group.id);
  }).map((group) => {
      return (
        <GroupItem
          key={group.id}
          group={group}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
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
            <h3>Join Group</h3>
          </Col>
        </Row>
        <Row>
          <Col>{alert && alertDOM}</Col>
        </Row>
      </Container>{" "}
      <ModalBody>
        <div style={{ maxHeight: "420px", overflowY: "auto" }}>
          {groupsDOM}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={selectedGroup == null}
          variant={selectedGroup != null ? "primary" : "dark"}
          onClick={create}
        >
          Join
        </Button>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
