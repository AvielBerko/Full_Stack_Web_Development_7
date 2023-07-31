import React, { useState } from "react";
import { createPortal } from "react-dom";
import ContextMenu from "../../common/ContextMenu/context-menu";
import { useContextMenu } from "../../../custom-hooks/use-context-menu"; // Import the custom hook
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../../../api/contacts";
import UpdateMessageModal from "./update-message/update-message-modal";
import ImageMessage from "./image-message";
import routes from "../../../env";

export default function Message({
  message,
  user,
  deleteMessageMutation,
  updateMessageMutation,
  setAlert,
}) {
  const [showUpdateMessageModal, setShowUpdateMessageModal] = useState(false);

  const contactsQuery = useQuery({
    queryKey: ["contacts", user.id],
    enabled: user?.id != undefined,
    queryFn: () => {
      return getContacts({}, user.token);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const {
    isContextMenuOpen,
    contextMenuPosition,
    contextMenuRef,
    openContextMenu,
    closeContextMenu,
  } = useContextMenu(); // Use the custom hook

  if (contactsQuery.isLoading) return <>Loading</>;
  if (contactsQuery.isError) return <>Error</>;

  const isSentByUser = message.sender_id === user.id;
  const isSentByContact = contactsQuery.data?.some(
    (contact) => contact.user_id === message.sender_id
  );

  const nameOrAddress = isSentByUser
    ? ""
    : isSentByContact
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

  const handleDelete = () => {
    deleteMessageMutation.mutate(message);
  };

  const updateMessageModalDOM = (
    <UpdateMessageModal
      message={message}
      updateMessageMutation={updateMessageMutation}
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
          {message.type === "text" && (
            <>
              <div className="d-flex justify-content-between gap-3 align-items-center">
                <div style={{ fontSize: "12px" }}>
                  <b>{nameOrAddress}</b>
                </div>
                {Boolean(message.edited) && (
                  <div style={{ fontSize: "10px", textAlign: "right" }}>
                    edited
                  </div>
                )}
              </div>
              <p style={{ marginBottom: "4px", wordWrap: "break-word" }}>{message.message}</p>
            </>
          )}
          {message.type === "image" && (
            <ImageMessage src={routes.getFile(message.message)} />
          )}
          {/*  <img
               src={routes.getFile(message.message)}
               style={{ maxWidth: "100%", maxHeight: "200px" }}
             /> */}
          {message.type === "video" && (
            <video
              src={routes.getFile(message.message)}
              style={{ maxWidth: "100%", maxHeight: "200px" }}
              controls
            />
          )}

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
              options={
                message.type === "text"
                  ? [
                      { Edit: () => setShowUpdateMessageModal(true) },
                      { Delete: handleDelete },
                    ]
                  : [{ Delete: handleDelete }]
              }
            />,
            document.body
          )}
      </div>
    </>
  );
}
