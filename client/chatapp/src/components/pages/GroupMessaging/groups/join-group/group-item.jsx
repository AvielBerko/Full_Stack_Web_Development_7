import React from "react";
import { ListGroupItem, Card } from "react-bootstrap";

export default function GroupItem({ group , selectedGroup, setSelectedGroup }) {
  if (!group) return <></>;

  const selected = selectedGroup === group.id;

  return (
    <ListGroupItem>
      <div onClick={() => setSelectedGroup(group.id)}>
        <Card>
          <Card.Body style={{background: selected ? "pink" : ""}}>
            <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
              {group.name}
            </Card.Title>
            {/* TODO - add participants */}
          </Card.Body>
        </Card>
      </div>
    </ListGroupItem>
  );
}
