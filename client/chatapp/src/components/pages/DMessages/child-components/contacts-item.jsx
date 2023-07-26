import React, { useState } from "react";
import { ListGroupItem, Card } from "react-bootstrap";
export default function ContactsItem({ user, contact, selectedContact, setSelectedContact }) {
  if (!contact) return <></>;
  
  const selected = selectedContact === contact.user_id;
  return (
    <ListGroupItem>
      <div onClick={() => setSelectedContact(contact.user_id)}>
        <Card>
          <Card.Body>
            <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
              {contact.name}
            </Card.Title>
          </Card.Body>
        </Card>
      </div>
    </ListGroupItem>
  );
}
