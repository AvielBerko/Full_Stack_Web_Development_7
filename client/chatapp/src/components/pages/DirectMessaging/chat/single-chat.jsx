import React, { useState, useRef} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../../../../api/dmessges";
import { Alert, Row, Col } from "react-bootstrap";
import Message from "./message";

export default function SingleChat({ user, contact_id }) {
  const [newMessage, setNewMessage] = useState("");
  const [alert, setAlert] = useState("");
  const buttonRef = useRef(null);
  const inputRef = useRef(null);


  const messagesQuery = useQuery({
    queryKey: ["messages", user?.id, contact_id],
    enabled: user?.id != null && contact_id != null,
    queryFn: () => {
      return getMessages({ id1: user.id, id2: contact_id /*, limit: 1000*/ });
    },
    refetchInterval: 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message) => sendMessage(message),
    onSuccess: (results) => {
        messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message)
    },
  });

  const handleSendMessage = () => {
    if (!newMessage) {
      setAlert("Please write a message.");
      return;
    }
    sendMessageMutation.mutate({
      message: newMessage,
      sender_id: user.id,
      receiver_id: contact_id,
      time_sent: new Date(),
      type: "text",
    });
    setNewMessage("");
  };

  const { data: messages, isLoading, isError } = messagesQuery;

  if (isLoading) return <></>;
  if (isError) return <>Error while fetching messages</>;

  // Sort the messages by time_sent in ascending order
  const sortedMessages = messages
    .slice()
    .sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // When the "Enter" key is pressed, trigger the button click event
      buttonRef.current.click();
    }
  };

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
    <>
    {alert && alertDOM}
    <div
      style={{
        maxWidth: "90%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "800px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sortedMessages.map((message) => {
          return (
            <Message
              key={message.id}
              message={message}
              user={user}
              contact_id={contact_id}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: "8px" }}>
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, marginRight: "8px" }}
        />
        <button
          ref={buttonRef}
          tabIndex="0"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
}
