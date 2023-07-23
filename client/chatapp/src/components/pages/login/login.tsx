import Input from "../../common/Input/input";
import React, { useState } from "react";
import { Container, Col, Row, Alert } from "react-bootstrap";
import BlockButton from "../../common/BlockButton/block-button";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../custom-hooks/use-session";
import login from "../../../api/login";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [_, setAuth] = useSession("auth", false);
  const navigate = useNavigate();

  const handleLogin = () => {
    login(username, password).then((user) => {
      if (user) {
        setAuth(user);
        navigate("/home", { replace: true });
      } else {
        setAlert("Wrong username or password.");
      }
    }).catch(() => setAlert("Wrong username or password."));
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
    <Container>
      <Row className="text-center">
        <Col>
          <h1>Login</h1>
        </Col>
      </Row>
      {alert && alertDOM}
      <Row>
        <Col>
          <Input
            inputType="text"
            placeholder="Username"
            value={username}
            setter={setUsername}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            inputType="password"
            placeholder="Password"
            value={password}
            setter={setPassword}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BlockButton onClick={handleLogin}>Login</BlockButton>
        </Col>
      </Row>
    </Container>
  );
}
