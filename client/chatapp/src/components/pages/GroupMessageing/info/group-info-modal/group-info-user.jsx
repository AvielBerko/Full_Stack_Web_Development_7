import React from "react";
import { ListGroupItem, Card } from "react-bootstrap";

export default function GroupinfoUser({ member }) {
  if (!member) return <></>;
  return (
    <ListGroupItem>
        <Card>
          <Card.Body>
            <Card.Title>
              {member?.name}
            </Card.Title>
          </Card.Body>
        </Card>
    </ListGroupItem>
  );
}
