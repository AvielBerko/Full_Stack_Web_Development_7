import { Card, Row, Col, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import EdibaleLabel from '../../../common/edibaleLabel/edibale-label';
import BlockButton from '../../../common/BlockButton/block-button';
import { updateUser } from '../../../../api/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../../../custom-hooks/use-session';

const UserInfo = ({ user, setUser }) => {
  // const { id, username, email, phoneNumber } = user;
  const [_, setAuth] = useSession("auth", null);

  const [isEditable, setIsEditable] = useState(false);
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number ?? "");

  const [alert, setAlert] = useState("");
  const [succ, setSucc] = useState(false)


  // Mutation function using react-query's useMutation hook
  const updateUserMutation = useMutation(updateUser, {
    onSuccess: (data) => {
      // Update the user in the session
      console.log(data);
      setAuth(data);
      setSucc(true);
      setAlert('Changes saved successfully');
      setIsEditable(false);
    },
    onError: (error) => {
      //setAlert('Error occurred while saving changes');
      setAlert(error.message);
    },
  });


  const closeAlert = () => {
    setAlert("");
  };

  const alertDOM = (
    <Row>
      <Col>
        <Alert variant={succ ? "success" : "danger"} onClose={closeAlert} dismissible>
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
        email,
        phone_number: phoneNumber
        //token: user.token,
      };
      updateUserMutation.mutate(newUser);
    }
    else {
      setIsEditable(true);
    }
  };

  return (<>
    {alert != "" && alertDOM}
    <Card className="user-card">
      <Card.Body>
      <EdibaleLabel isEditable={false} label='Email' setter={setEmail} value={email} WrapperComponent={Card.Title} />
      <EdibaleLabel isEditable={isEditable} label='Username' setter={setUsername} value={username} WrapperComponent={Card.Text} />
      <EdibaleLabel isEditable={isEditable} label='Phone Number' setter={setPhoneNumber} value={phoneNumber} WrapperComponent={Card.Text} />
      </Card.Body>
    </Card>
    <BlockButton onClick={() => {
      if (isEditable) {
         onSubmit();
      }      
      setIsEditable(!isEditable);
      }
      }>{isEditable ? "Save" : "Edit"}</BlockButton>
  </>
  );
};

export default UserInfo;