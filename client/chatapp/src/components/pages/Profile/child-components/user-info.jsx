import { Card, Row, Col, Alert, Button } from "react-bootstrap";
import React, { useState } from "react";
import EdibaleLabel from "../../../common/edibaleLabel/edibale-label";
import BlockButton from "../../../common/BlockButton/block-button";
import { updateUser } from "../../../../api/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../../../../custom-hooks/use-session";

const UserInfo = ({ user, setAuth }) => {
  // const { id, username, email, phoneNumber } = user;

  const [isEditable, setIsEditable] = useState(false);
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number ?? "");

  const [alert, setAlert] = useState("");
  const [succ, setSucc] = useState(false);

  // Mutation function using react-query's useMutation hook
  const updateUserMutation = useMutation({
    mutationFn: (newUser) => updateUser(newUser, user.token),
    onSuccess: (data) => {
      // Update the user in the session
      setAuth(data);
      setSucc(true);
      setAlert("Changes saved successfully");
      setIsEditable(false);
    },
    onError: (error) => {
      setSucc(false);
      setAlert(error.message);
    },
  });

  const closeAlert = () => {
    setAlert("");
  };

  const alertDOM = (
    <Row>
      <Col>
        <Alert
          variant={succ ? "success" : "danger"}
          onClose={closeAlert}
          dismissible
        >
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  const onSubmit = () => {
    if (isEditable) {
      const newUser = {
        id: user.id,
        username,
        phone_number: phoneNumber,
      };
      updateUserMutation.mutate(newUser);
    } else {
      setIsEditable(true);
    }
  };

  return (
    <>
      {alert != "" && alertDOM}
      <Card className="user-card">  
      <Card.Header>
        <Card.Title>
          <h3>User Details:</h3>
        </Card.Title>
      </Card.Header>
      <Card.Body>
          <EdibaleLabel
            isEditable={false}
            label="Email"
            value={email}
            WrapperComponent={Card.Title}
          />
          <EdibaleLabel
            isEditable={isEditable}
            label="Username"
            setter={setUsername}
            value={username}
            WrapperComponent={Card.Text}
          />
          <EdibaleLabel
            isEditable={isEditable}
            label="Phone Number"
            setter={setPhoneNumber}
            value={phoneNumber}
            WrapperComponent={Card.Text}
          />
        </Card.Body>
        <Card.Footer className="text-center">
          <BlockButton
            variant="primary"
            onClick={() => {
              if (isEditable) {
                onSubmit();
              } else {
                setIsEditable(true);
              }
            }}
          >
            {isEditable ? "Save" : "Edit"}
          </BlockButton>
        </Card.Footer>
      </Card>
    </>
  );
};

export default UserInfo;
