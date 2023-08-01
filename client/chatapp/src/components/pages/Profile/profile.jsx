import React from "react";
import { useSession } from "../../../custom-hooks/use-session";
import { Container, Row, Col } from "react-bootstrap";
import UserInfo from "./child-components/user-info";
import "../../../css/profile.css";

export default function Profile() {
  const [user, setUser] = useSession("auth", null);

  if (!user?.id) return <></>;

  return (
    <Container className="py-4 custom-container">
      <Row className="text-center">
        <Col>
          <h1 className="mb-4">My Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <UserInfo user={user} setAuth={setUser}></UserInfo>
        </Col>
      </Row>
    </Container>
  );
}
