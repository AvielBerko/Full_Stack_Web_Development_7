import React, { useState } from "react";
import GroupInfoModal from "./group-info-modal/group-info-modal";
import { Card } from "react-bootstrap";
import { getGroupMembers } from "../../../../api/groups";
import { useQuery } from "@tanstack/react-query";

export default function GroupInfo({ user, group_id }) {
  if (!group_id) return <></>;

  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);

  const groupMembersQuery = useQuery({
    queryKey: ["groups", group_id, "members"],
    enabled: user?.id != null && group_id != null,
    queryFn: () => {
      return getGroupMembers(group_id, user.token);
    },
    staleTime: 1000 * 60 * 5,
  });

  const groupInfoModalDOM = (
    <GroupInfoModal
      group_id={group_id}
      user={user}
      groupMembersQuery = {groupMembersQuery}
      showState={[showGroupInfoModal, setShowGroupInfoModal]}
    />
  );

  return (
    <>
      {groupInfoModalDOM}
      <Card className="h-100" onClick={() => setShowGroupInfoModal(true)}>
        <Card.Body className="d-flex flex-column">
          {/* <Card.Title className="text-center">{groupQuery?.data?.name}</Card.Title> */}
          <Card.Text className="text-center">
            {groupMembersQuery?.data?.length} members
          </Card.Text>
        </Card.Body>
        {/* <ListGroup className="flex-grow-1">
          {group.members.map((member) => (
            <ListGroupItem key={member.id}>{member.name}</ListGroupItem>
          ))}
        </ListGroup> */}
      </Card>
    </>
  );
}
