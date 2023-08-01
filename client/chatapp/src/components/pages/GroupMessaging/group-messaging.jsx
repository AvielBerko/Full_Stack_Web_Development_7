import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import GroupsList from "./groups/groups-list";
import GroupChat from "./chat/group-chat";
import { useSession } from "../../../custom-hooks/use-session";

export default function GroupMessaging() {
  const [user, _] = useSession("auth", null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth < 768);
  });

  return (
    <Container fluid>
      <Row>
        {(!isMobile || !selectedGroup) && (
          <Col
            md={3}
            style={{ borderRight: "1px solid #ccc", padding: "16px" }}
          >
            <GroupsList
              user={user}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
            />
          </Col>
        )}
        <Col md={8} style={{ padding: "16px" }}>
          <Row>
            <GroupChat user={user} group_id={selectedGroup} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
