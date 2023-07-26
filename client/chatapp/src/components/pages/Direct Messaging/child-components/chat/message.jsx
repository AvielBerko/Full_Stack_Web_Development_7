import React, { useState } from "react";
import { ListGroupItem } from "react-bootstrap";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import ContextMenu from "../../../../common/ContextMenu/context-menu";
import { useContextMenu } from "../../../../../custom-hooks/use-context-menu"; // Import the custom hook
import { deleteMessage } from "../../../../../api/direct_messaging";
import UpdateMessageModal from "./update-message/update-message-modal";

export default function Message({ message, isSentByUser }) {
  const [showUpdateMessageModal, setShowUpdateMessageModal] = useState(false);

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
    mutationFn: () => deleteMessage(message.id),
    onSuccess: (results) => {
      if (results === "") {
        queryClient.invalidateQueries(["messages"]);
      } else {
        setAlert(results);
      }
    },
    onError: () => {
      setAlert("An unexpected error occurred. Please try again later.");
    },
  });

  const handleDelete = () => {
    deleteMessageMutation.mutate();
  };

  const updateMessageModalDOM = (
      <UpdateMessageModal
        message={message}
        showState={[showUpdateMessageModal, setShowUpdateMessageModal]}
      />
  );

  return (
    <>
      {" "}
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
          <div style={{ marginBottom: "4px" }}>{message.message}</div>
          <div style={{ fontSize: "12px", textAlign: "right" }}>
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
