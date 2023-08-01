import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Alert,
  Container,
  Card,
  Button,
} from "react-bootstrap";
import GroupsItem from "./groups-item";
import { getGroups } from "../../../../api/groups";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import JoinGroupModal from "./join-group/join-group-modal";
import BlockButton from "../../../common/BlockButton/block-button";
import AddGroupModal from "./add-group/add-group-modal";

export default function GroupsList({ user, selectedGroup, setSelectedGroup }) {
  const GROUPS_PER_PAGE = 10;

  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [alert, setAlert] = useState("");

  if (!user?.id) return <></>;

  const groupsQuery = useQuery({
    queryKey: ["groups", "user_id", user.id],
    enabled: user?.id != undefined,
    queryFn: () => {
      return getGroups({ user_id: user.id }, user.token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setAlert(error.message);
    },
  });


  if (groupsQuery.isLoading) return <>Loading</>;
  let groupsDOM = null;
  if (groupsQuery.data?.length) {
    groupsDOM = groupsQuery.data.map((group) => (
      <GroupsItem
        key={group.id}
        group={group}
        user={user}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setAlert={setAlert}
      />
    ));
  }

  const alertDOM = (
    <Row>
      <Col>
        <Alert variant="danger" onClose={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  const joinGroupModalDOM = (
    <JoinGroupModal
      user={user}
      showState={[showJoinGroupModal, setShowJoinGroupModal]}
      userGroups={groupsQuery.data}
      refetchGroups={groupsQuery.refetch}
      //setAlert={setAlert}
    />
  );

  const addGroupModalDOM = (
    <AddGroupModal
      user={user}
      showState={[showAddGroupModal, setShowAddGroupModal]}
      refetchGroups={groupsQuery.refetch}
    />
  );

  return (
    <>
      {alert && alertDOM}
      {showJoinGroupModal && joinGroupModalDOM}
      {showAddGroupModal && addGroupModalDOM}
      <Card>
        <Card.Header>
          <Card.Title>My Groups:</Card.Title>
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <Row className="d-flex gap-1">

          <Button
            variant="primary"
            onClick={() => setShowAddGroupModal(true)}
            >
            Create Group
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowJoinGroupModal(true)}
            >
            Join Group
          </Button>
        </Row>
        </Card.Header>
        <div
          style={{
            backgroundColor: "#fff",
            height: "500px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {groupsDOM ?? <>No data</>}
        </div>
      </Card>
    </>
  );
}