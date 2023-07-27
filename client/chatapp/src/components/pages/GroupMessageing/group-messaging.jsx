import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import GroupsList from "./groups/groups-list";
import GroupChat from "./chat/group-chat";
import { useSession } from "../../../custom-hooks/use-session";

export default function GroupMessaging() {
  const [user, _] = useSession("auth", null);
  
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <Container fluid>
      <Row className="text-center">
        <Col md={3}/>
        <Col md={8}>
          <h1>Group Messages</h1>
        </Col>
      </Row>
      <Row>
       <Col md={3} style={{ borderRight: '1px solid #ccc', padding: '16px' }}>
         <GroupsList user={user} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
       </Col>
       <Col md={8} style={{ padding: '16px' }}>
         {/* Replace 'selectedGroup' with the actual selected contact */}
         <GroupChat user={user} contact_id={selectedGroup} />
       </Col>
     </Row>
    </Container>
  );
}