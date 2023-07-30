import React from "react";
import { useSession } from "../../../custom-hooks/use-session";
import { Container, Row, Col } from "react-bootstrap";
import UserInfo from "./child-components/user-info";

export default function Profile() {
  const [user, setUser] = useSession("auth", null);

  if (!user?.id) return <></>;

  return (
    <Container>
      <Row className="text-center">
        <Col>
          <h1>My Profile</h1>
        </Col>
      </Row>
      {/* Profile Picrute */}
      <Row>
        <Col>
          <UserInfo user={user} setAuth={setUser}></UserInfo>
        </Col>
      </Row>
    </Container>
  );
}
