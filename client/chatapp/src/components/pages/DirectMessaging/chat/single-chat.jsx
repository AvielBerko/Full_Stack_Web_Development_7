import React, { useState} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../../../../api/dmessges";
import { sendFile } from "../../../../api/upload"
import { Alert, Row, Col } from "react-bootstrap";
import Message from "./message";

export default function SingleChat({ user, contact_id }) {
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState("");

  const messagesQuery = useQuery({
    queryKey: ["messages", user?.id, contact_id],
    enabled: user?.id != null && contact_id != null,
    queryFn: () => {
      return getMessages(contact_id, { saver_id: user.id /*, limit: 1000*/ });
    },
    refetchInterval: 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message) => sendMessage(contact_id, message),
    onSuccess: (results) => {
        messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message)
    },
  });

  const sendFileMutation = useMutation({
    mutationFn: (file) => sendFile(file),
    onMutate: (file) => {
      return file;
    },
    onSuccess: (data, variables, context) => {
        setAlert("SUCCESS");
        sendMessageMutation.mutate({
          message: results.data,
          sender_id: user.id,
          time_send: new Date(),
          type: file.type.split("/")[0],
        })
        setFile(null);
        //messagesQuery.refetch();
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
//      receiver_id: contact_id,
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
    }
    else {
      handleSendMessage();
    }
  }

  const handleSelectFile = (event) => {
    setFile(event.target.files[0]);
  };

  
  const { data: messages, isLoading, isError } = messagesQuery;

  if (isLoading) return <></>;
  if (isError) return <>Error while fetching messages</>;

  // // Sort the messages by time_sent in ascending order
  // const sortedMessages = messages
  //   .slice()
  //   .sort((a, b) => new Date(a.time_sent) - new Date(b.time_sent));

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // When the "Enter" key is pressed send a message
      handleSendMessage();
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
        {messages.map((message) => {
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
         <button
        tabIndex="1"
        onClick={() => { // Separate handler for selecting a file
          // Using a hidden input element to trigger the file selection
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.onchange = handleSelectFile;
          fileInput.click();
        }}
    >
      Select File
    </button>
        {/* <input type="file" onChange={handleSelectFile} />
        <button
        tabIndex="1"
        onClick={handleFileUpload}>
          Upload File
        </button> */}
        <button
          tabIndex="0"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
}
