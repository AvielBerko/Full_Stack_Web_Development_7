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
      return getGroupMessages(group_id, user.token);
    },
    refetchInterval: 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message) => sendGroupMessage(group_id, message, user.token),
    onSuccess: (results) => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (message) => deleteGroupMessage(group_id, message.id, user.token),
    onSuccess: (results) => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const updateMessageMutetion = useMutation({
    mutationFn: (message) => updateGroupMessage(group_id, message, user.token),
    onSuccess: (results) => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

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
