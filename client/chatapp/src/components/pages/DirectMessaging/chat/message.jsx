import React, { useState } from "react";
import { ListGroupItem } from "react-bootstrap";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import ContextMenu from "../../../common/ContextMenu/context-menu";
import { useContextMenu } from "../../../../custom-hooks/use-context-menu"; // Import the custom hook
import { deleteMessage } from "../../../../api/dmessges";
import UpdateMessageModal from "./update-message/update-message-modal";

export default function Message({ message, user, contact_id }) {
  const [showUpdateMessageModal, setShowUpdateMessageModal] = useState(false);
  const queryClient = useQueryClient();
  const isSentByUser = message.sender_id === user.id;
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
        queryClient.refetchQueries(["messages", user?.id, contact_id]);
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
         {Boolean(message.edited) && (<div style={{ fontSize: "10px", textAlign: "right" }}>
            edited
          </div>)}
          <div style={{ marginBottom: "4px"}}>{message.message}</div>
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
