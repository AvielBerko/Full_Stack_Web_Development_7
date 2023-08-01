import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import ContactList from "./contacts/contacts-list";
import SingleChat from "./chat/single-chat";
import { useSession } from "../../../custom-hooks/use-session";

export default function DirectMessaging() {
  const [user, _] = useSession("auth", null);
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth < 768);
  });

  return (
    <Container fluid>
      <Row>
        {(!isMobile || !selectedContact) &&
       <Col md={3} style={{ borderRight: '1px solid #ccc', padding: '16px' }}>
         <ContactList user={user} selectedContact={selectedContact} setSelectedContact={setSelectedContact} />
       </Col>
      }
       <Col md={8} style={{ padding: '16px' }}>
         {/* Replace 'selectedContact' with the actual selected contact */}
         <SingleChat user={user} contact_id={selectedContact} />
       </Col>
     </Row>
    </Container>
  );
}
