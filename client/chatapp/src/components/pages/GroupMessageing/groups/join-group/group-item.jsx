import React from "react";
import { ListGroupItem, Card } from "react-bootstrap";

export default function GroupItem({ user, selectedUser, setSelectedUser }) {
  if (!user) return <></>;

  const selected = selectedUser === user.id;

  return (
    <ListGroupItem>
      <div onClick={() => setSelectedUser(user.id)}>
        <Card>
          <Card.Body style={{background: selected ? "pink" : ""}}>
            <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
              {user.username}
            </Card.Title>
            {/* TODO - add participants */}
          </Card.Body>
        </Card>
      </div>
    </ListGroupItem>
  );
}
