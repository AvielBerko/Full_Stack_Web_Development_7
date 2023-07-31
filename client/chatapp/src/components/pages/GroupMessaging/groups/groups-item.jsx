import React, { useState } from "react";
import { ListGroupItem, Card, Button, ListGroup } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteGroup,
  leaveGroup,
  getGroupMembers,
} from "../../../../api/groups";
import { createPortal } from "react-dom";
import UpdateGroupModal from "./update-group/update-group-modal";
import GroupInfoModal from "./info/group-info-modal/group-info-modal";
import { useContextMenu } from "../../../../custom-hooks/use-context-menu";
import ContextMenu from "../../../common/ContextMenu/context-menu";

export default function GroupsItem({
  group,
  user,
  selectedGroup,
  setSelectedGroup,
  setAlert,
}) {
  if (!group) return <></>;

  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);

  const {
    isContextMenuOpen,
    contextMenuPosition,
    contextMenuRef,
    openContextMenu,
    closeContextMenu,
  } = useContextMenu(); // Use the custom hook

  const handleContextMenu = (event) => {
    openContextMenu(event);

    // Trigger the click event programmatically (simulating a regular click)
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0, // 0 for left click, 1 for middle click, 2 for right click
    });
    event.currentTarget.dispatchEvent(clickEvent);
  };
  const queryClient = useQueryClient();

  const selected = selectedGroup === group.id;
  const admin = Boolean(group.admin);

  const groupMembersQuery = useQuery({
    queryKey: ["groups", group.id, "members"],
    enabled: user?.id != null && group.id != null,
    queryFn: () => {
      return getGroupMembers(group.id, user.token);
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteGroupMutation = useMutation({
    mutationFn: () => deleteGroup(group.id, user.token),
    onSuccess: (results) => {
      if (results === "") {
        queryClient.invalidateQueries(["groups"]);
      } else {
        setAlert(results);
      }
    },
    onError: (error) => {
      //setAlert("An unexpected error occurred. Please try again later.");
      setAlert(error.message);
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: (data) => leaveGroup(data.groupID, data.userID, user.token),
    onSuccess: (results) => {
      queryClient.invalidateQueries(["groups", "user_id", user.id]);
      setSelectedGroup(null);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const handleDelete = () => {
    deleteGroupMutation.mutate();
  };

  const handleLeave = () => {
    leaveGroupMutation.mutate({ groupID: group.id, userID: user.id });
  };

  const updateGroupModalDOM = (
    <UpdateGroupModal
      group={group}
      user={user}
      showState={[showUpdateGroupModal, setShowUpdateGroupModal]}
      setAlert={setAlert}
    />
  );

  const groupInfoModalDOM = (
    <GroupInfoModal
      group_id={group.id}
      user={user}
      groupMembersQuery={groupMembersQuery}
      showState={[showGroupInfoModal, setShowGroupInfoModal]}
    />
  );

  return (
    <div onContextMenu={handleContextMenu}>
      {admin && updateGroupModalDOM}
      {groupInfoModalDOM}
      <ListGroupItem>
        <div
          onClick={() => {
            setSelectedGroup(group.id);
          }}
        >
          <Card
            style={{
              border: selected ? "2px solid #007bff" : "1px solid #ced4da",
              borderRadius: "8px",
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
                {group.name}
              </Card.Title>
              <Card.Text style={{ fontSize: "12.5px" }}>
                Created: {new Date(group.time_created).toLocaleDateString()}
              </Card.Text>
              <Card.Text style={{ fontSize: "12.5px" }}>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowGroupInfoModal(true)}
                >
                  {groupMembersQuery?.data?.length} Members
                </a>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </ListGroupItem>
      {isContextMenuOpen &&
        createPortal(
          <ContextMenu
            contextMenuRef={contextMenuRef}
            contextMenuPosition={contextMenuPosition}
            onClose={closeContextMenu}
            options={
              admin
                ? [
                    { Edit: () => setShowUpdateGroupModal(true) },
                    { Delete: handleDelete },
                    { Leave: handleLeave },
                  ]
                : [{ Leave: handleLeave }]
            }
          />,
          document.body
        )}
    </div>
  );
}
