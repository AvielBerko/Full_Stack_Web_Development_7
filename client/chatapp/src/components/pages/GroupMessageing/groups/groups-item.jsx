import React, { useState } from "react";
import { ListGroupItem, Card, Button, ListGroup } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup, leaveGroup } from "../../../../api/groups";
import { createPortal } from "react-dom";
import UpdateGroupModal from "./update-group/update-group-modal";
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

  const deleteGroupMutation = useMutation({
    mutationFn: () => deleteGroup(group.id),
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
    mutationFn: (data) => leaveGroup(data.groupID, data.userID),
    onSuccess: (results) => {
      queryClient.invalidateQueries(["groups", user.id]);
    },
    onError: (error) => {
      //setAlert("An unexpected error occurred. Please try again later.");
      setAlert(error.message);
    },
  });

  const handleDelete = () => {
    //deleteGroupMutation.mutate();
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

  return (
    <div onContextMenu={handleContextMenu}>
      {updateGroupModalDOM}
      <ListGroupItem>
        <div
          onClick={() => {
            setSelectedGroup(group.id);
          }}
        >
          <Card>
            <Card.Body>
              <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
                {group.name}
              </Card.Title>
              <Card.Text style={{ fontSize: "12.5px" }}>
                Created: {new Date(group.time_created).toLocaleDateString()}
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
            onEdit={() => setShowUpdateGroupModal(true)}
            onDelete={handleDelete}
          />,
          document.body
        )}
    </div>
  );
}
