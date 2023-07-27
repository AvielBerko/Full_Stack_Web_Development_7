import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ContextMenu from "../../../common/ContextMenu/context-menu";
import { useContextMenu } from "../../../../custom-hooks/use-context-menu"; // Import the custom hook
import { getContacts } from "../../../../api/contacts";
import { deleteGroupMessage } from "../../../../api/gmessages";
import UpdateMessageModal from "./update-message/update-message-modal";

export default function GroupMessage({ message, user, groupID }) {
  const [showUpdateMessageModal, setShowUpdateMessageModal] = useState(false);
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: ["contacts", user.id],
    enabled: user?.id != undefined,
    queryFn: () => {
      return getContacts(user.id);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const isSentByUser = message.sender_id === user.id;
  const isSentByContact = contactsQuery.data?.some(
    (contact) => contact.user_id === message.sender_id
  );

  const nameOrAddress = isSentByContact
    ? contactsQuery.data?.find(
        (contact) => contact.user_id === message.sender_id
      )?.name
    : message.email;

  const senderStyle = isSentByUser
    ? {
        alignSelf: "flex-end",
        backgroundColor: "#007bff",
        color: "#fff",
        margin: "5px",
      }
    : {
        alignSelf: "flex-start",
        backgroundColor: "#b0b0b0",
        color: "#000",
        margin: "5px",
      };

  const {
    isContextMenuOpen,
    contextMenuPosition,
    contextMenuRef,
    openContextMenu,
    closeContextMenu,
  } = useContextMenu(); // Use the custom hook

  const handleContextMenu = (event) => {
    if (!isSentByUser) return;
    openContextMenu(event);
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0, // 0 for left click, 1 for middle click, 2 for right click
    });
    event.currentTarget.dispatchEvent(clickEvent);
  };

  const deleteMessageMutation = useMutation({
    mutationFn: () => deleteGroupMessage(groupID, message.id),
    onSuccess: (results) => {
      if (results === "") {
        queryClient.refetchQueries(["groups", groupID, "messages"]);
      } else {
        setAlert(results);
      }
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const handleDelete = () => {
    deleteMessageMutation.mutate();
  };

  const updateMessageModalDOM = (
    <UpdateMessageModal
      message={message}
      showState={[showUpdateMessageModal, setShowUpdateMessageModal]}
      groupID={groupID}
    />
  );

  return (
    <>
      {updateMessageModalDOM}
      <div
        onContextMenu={handleContextMenu}
        style={{
          padding: "8px",
          borderRadius: "8px",
          marginBottom: "8px",
          maxWidth: "50%",
          ...senderStyle,
        }}
      >
        <div key={message.id}>
          <div className="d-flex justify-content-between gap-3 align-items-center">
            <div style={{ fontSize: "12px" }}>
              <b>{nameOrAddress}</b>
            </div>
          {Boolean(message.edited) && (
            <div style={{ fontSize: "10px", textAlign: "right" }}>edited</div>
          )}
          </div>
          <div style={{ marginTop: "2px", marginBottom: "3px"}}>{message.message}</div>
          <div style={{ fontSize: "10px", textAlign: "right" }}>
            {new Date(message.time_sent).toLocaleString()}
          </div>
        </div>
        {isContextMenuOpen &&
          createPortal(
            <ContextMenu
              contextMenuRef={contextMenuRef}
              contextMenuPosition={contextMenuPosition}
              onClose={closeContextMenu}
              onEdit={() => setShowUpdateMessageModal(true)}
              onDelete={handleDelete}
            />,
            document.body
          )}
      </div>
    </>
  );
}
