import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "../../../api/contacts";
import UpdateMessageModal from "./update-message/update-message-modal";
import ImageMessage from "./image-message";
import routes from "../../../env";
import { Dropdown } from "react-bootstrap";
import "../../../css/message.css";

export default function Message({
  message,
  user,
  deleteMessageMutation,
  updateMessageMutation,
  setAlert,
}) {
  const [showUpdateMessageModal, setShowUpdateMessageModal] = useState(false);

  // INTEREST
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

  if (contactsQuery.isLoading) return <>Loading</>;
  if (contactsQuery.isError) return <>Error</>;

  const isSentByUser = message.sender_id === user.id;
  const isSentByContact = contactsQuery.data?.some(
    (contact) => contact.user_id === message.sender_id
  );

  const senderStyle = isSentByUser ? "user-message" : "other-message";

  const nameOrAddress = isSentByUser
    ? ""
    : isSentByContact
    ? contactsQuery.data?.find(
        (contact) => contact.user_id === message.sender_id
      )?.name
    : message.email;


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

  const dropdownDOM = (
    <Dropdown>
      <Dropdown.Toggle
        variant=""
        id="dropdown-basic"
        style={{ fontSize: "0.7rem" }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {message.type === "text" && (
          <Dropdown.Item onClick={() => setShowUpdateMessageModal(true)}>
            Edit
          </Dropdown.Item>
        )}
        <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      {updateMessageModalDOM}
      <div className={`message ${senderStyle}`}>
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
              <div className="d-flex justify-content-between  align-items-center">
                <p style={{ marginBottom: "4px", wordWrap: "break-word" }}>
                  {message.message}
                </p>
                {isSentByUser && dropdownDOM}
              </div>
            </>
          )}
          {message.type === "image" && (
            <>
              <div style={{ textAlign: "right" }}>
                {isSentByUser && dropdownDOM}
              </div>
              <ImageMessage src={routes.getFile(message.message)} />
            </>
          )}
          {message.type === "video" && (
            <>
              <div style={{ textAlign: "right" }}>
                {isSentByUser && dropdownDOM}
              </div>
              <video
                src={routes.getFile(message.message)}
                style={{ maxWidth: "100%", maxHeight: "200px" }}
                controls
              />
            </>
          )}
          <div style={{ fontSize: "10px", textAlign: "right" }}>
            {new Date(message.time_sent).toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
}
