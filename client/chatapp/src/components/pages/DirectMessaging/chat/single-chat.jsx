import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "../../../../api/dmessges";
import { Row, Col, Alert } from "react-bootstrap";
import Chat from "../../../common/Chat/chat";

export default function SingleChat({ user, contact_id }) {
  const [alert, setAlert] = useState("");

  //const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ["messages", user?.id, contact_id],
    enabled: user?.id != null && contact_id != null,
    queryFn: () => {
      return getMessages(contact_id, { saver_id: user.id /*, limit: 1000*/ }, user.token);
    },
    refetchInterval: 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message) => sendMessage(contact_id, message, user.token),
    onSuccess: (results) => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (message) => deleteMessage(contact_id, message.id, user.token),
    onSuccess: (results) => {
      //queryClient.refetchQueries(["messages", user?.id, contact_id]);
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const updateMessageMutetion = useMutation({
    mutationFn: (message) => updateMessage(contact_id, message, user.token),
    onSuccess: (results) => {
      messagesQuery.refetch();
      //queryClient.invalidateQueries(["messages"]);
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const alertDOM = (
    <Row>
      <Col>
        <Alert variant="danger" onClose={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  return (
    <>
      {alert && alertDOM}
      <Chat
        user={user}
        messagesQuery={messagesQuery}
        sendMessageMutation={sendMessageMutation}
        deleteMessageMutation={deleteMessageMutation}
        updateMessageMutation={updateMessageMutetion}
        setAlert={setAlert}
      />
    </>
  );
}
