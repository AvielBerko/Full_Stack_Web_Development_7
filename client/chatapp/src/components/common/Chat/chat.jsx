import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendFile } from "../../../api/files";
import Message from "../Message/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFileUpload } from '@fortawesome/free-solid-svg-icons';

import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

export default function Chat({
  user,
  messagesQuery,
  sendMessageMutation,
  deleteMessageMutation,
  updateMessageMutation,
  setAlert,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);

  const sendFileMutation = useMutation({
    mutationFn: (file) => sendFile(file),
    onSuccess: (results) => {
      sendMessageMutation.mutate({
        message: results.data,
        time_sent: new Date(),
        type: file.type.split("/")[0],
      });
      setFile(null);
    },
    onError: (error) => {
      setAlert(error.message); // TODO hadle errors
    },
  });

  const handleSendMessage = () => {
    if (!newMessage) {
      setAlert("Please write a message.");
      return;
    }
    sendMessageMutation.mutate({
      message: newMessage,
      time_sent: new Date(),
      type: "text",
    });
    setNewMessage("");
  };

  const handleSendFile = () => {
    const fd = new FormData();
    fd.append("file", file);
    sendFileMutation.mutate(fd);
  };

  const handleSend = () => {
    if (file) {
      handleSendFile();
    } else {
      handleSendMessage();
    }
  };

  const handleSelectFile = (event) => {
    setFile(event.target.files[0]);
  };

  const { data: messages, isLoading, isError } = messagesQuery;

  if (isLoading) return <></>;
  if (isError) return <>Error while fetching messages</>;

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // When the "Enter" key is pressed send a message
      handleSendMessage();
    }
  };

  return (
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
          backgroundColor: "#fff",
          height: "600px",
          // height: "100%",
          overflowY: "scroll",
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              message={message}
              user={user}
              deleteMessageMutation={deleteMessageMutation}
              updateMessageMutation={updateMessageMutation}
              setAlert={setAlert}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: "8px" }}>
        {file ? (
          <p>{file.name}</p>
        ) : (
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, marginRight: "8px" }}
          />
        )}
        <div className="d-flex">
          <Row>
            <Col className="pl-1">
              <Button
                tabIndex="1"
                onClick={() => {
                  // Separate handler for selecting a file
                  // Using a hidden input element to trigger the file selection
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  // accept only images and videos
                  fileInput.accept = "image/*,video/*";
                  fileInput.onchange = handleSelectFile;
                  fileInput.click();
                }}
              >
              <FontAwesomeIcon icon={faFileUpload} />
              </Button>
            </Col>
            <Col className="p-0">
              <Button tabIndex="0" onClick={handleSend}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
