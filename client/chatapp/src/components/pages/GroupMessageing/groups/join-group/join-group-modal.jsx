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
import { addGroup, getAllGroups } from "../../../../../api/groups";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function AddGroupModal({
  group,
  showState,
  groups,
  refetchGroups,
}) {
  const [name, setName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [alert, setAlert] = useState("");
  const [show, setShow] = showState;

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: () => {
      return getAllGroups();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addGroupMutation = useMutation({
    mutationFn: (group) => addGroup(group),
    onSuccess: (results) => {
        refetchGroups();
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
    if (!selectedGroup) {
      setAlert("Please select a group.");
      return;
    }
    addGroupMutation.mutate({
      name,
      group_id: selectedGroup,
      saver_id: group.id,
    });
  };

  const resetModal = () => {
    setName("");
    setAlert("");
    setSelectedGroup(null);
  };

  useEffect(() => {
    resetModal();
  }, [show]);

  if (groupsQuery.isLoading) return <>Loading</>;
  if (groupsQuery.isError) return <>Error: {error.message}</>;
  if (!groupsQuery.data.length) return <>No data</>;
  // add a filter to remove the groups that are already groups
  // filter also the current group
  const groupsDOM = groupsQuery?.data
    ?.filter((u) => {
      // filter the groups that are already groups
      return !groups.some((group) => group.group_id === u.id);
    })
    .map((group) => {
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
            <h3>Add Group</h3>
          </Col>
        </Row>
        <Row>
          <Col>{alert && alertDOM}</Col>
        </Row>
      </Container>{" "}
      <ModalBody>
        <FormLabel><h4>Groups Name:</h4></FormLabel>
        <InputGroup>
          <FormControl
            placeholder="Write here the Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <div style={{ maxHeight: "520px", overflowY: "auto" }}>
          {groupsDOM}
        </div>

      </ModalBody>
      <ModalFooter>
        <Button
          disabled={selectedGroup == null || name === ""}
          variant={selectedGroup != null && name != "" ? "success" : "dark"}
          onClick={create}
        >
          Add Group
        </Button>
        <Button variant="danger" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
