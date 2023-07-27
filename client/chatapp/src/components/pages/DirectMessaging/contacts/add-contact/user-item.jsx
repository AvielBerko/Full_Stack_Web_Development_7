import React from "react";
import { ListGroupItem, Card } from "react-bootstrap";

export default function UserItem({ user, selectedUser, setSelectedUser }) {
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
            <Card.Text>{user.email}</Card.Text>
            <Card.Text>{user.phone_number}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </ListGroupItem>
  );
}
