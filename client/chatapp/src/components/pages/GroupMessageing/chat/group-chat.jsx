import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getGroupMessages,
  sendGroupMessage,
  deleteGroupMessage,
  updateGroupMessage,
} from "../../../../api/gmessages";
import { Alert, Row, Col } from "react-bootstrap";
import Chat from "../../../common/Chat/chat";

export default function GroupChat({ user, group_id }) {
  const [alert, setAlert] = useState("");

  const messagesQuery = useQuery({
    queryKey: ["groups", group_id, "messages"],
    enabled: user?.id != null && group_id != null,
    queryFn: () => {
      return getGroupMessages(group_id);
    },
    refetchInterval: 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message) => sendGroupMessage(group_id, message),
    onSuccess: (results) => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (message) => deleteGroupMessage(group_id, message.id),
    onSuccess: (results) => {
      //queryClient.refetchQueries(["groups", group_id, "messages"]);
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const updateMessageMutetion = useMutation({
    mutationFn: (message) => updateGroupMessage(group_id, message),
    onSuccess: (results) => {
      //    queryClient.invalidateQueries(["groups", group_id, "messages"])
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  // const handleSendMessage = () => {
  //   if (!newMessage) {
  //     setAlert("Please write a message.");
  //     return;
  //   }
  //   sendMessageMutation.mutate({
  //     message: newMessage,
  //     sender_id: user.id,
  //     time_sent: new Date(),
  //     type: "text",
  //   });
  //   setNewMessage("");
  // };

  // const { data: messages, isLoading, isError } = messagesQuery;

  // if (isLoading) return <></>;
  // if (isError) return <>Error while fetching messages</>;

  // Sort the messages by time_sent in ascending order
  // const sortedMessages = messages
  //   .slice()
  //   .sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     // When the "Enter" key is pressed, trigger the button click event
  //     buttonRef.current.click();
  //   }
  // };

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
      {/* <div
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
        {messages.map((message) => {
          return (
            <GroupMessage
              key={message.id}
              message={message}
              user={user}
              groupID={groupID}
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
    </div> */}
      <Chat
        user={user}
        messagesQuery={messagesQuery}
        sendMessageMutation={sendMessageMutation}
        deleteMessageMutation={deleteMessageMutation}
        updateMessageMutation={updateMessageMutetion}
      />
    </>
  );
}
