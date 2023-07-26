import React,{ useState } from "react";
import { ListGroupItem, Card, Button } from "react-bootstrap";
import EdibaleLabel from "../../../common/edibaleLabel/edibale-label";

export default function ContactsItem({
  user,
  contact,
  onDeleted,
  onUpdated,
  selectedContact,
  setSelectedContact,
}) {
  if (!contact) return <></>;

  const [isEditable, setIsEditable] = useState(false);
  const [newName, setNewName] = useState(contact.name || "");

  const selected = selectedContact === contact.id;

  const handleEdit = () => {
    onUpdated({ ...contact, name: newName });
    setIsEditable(false);
  };

  return (
    <ListGroupItem>
      <div onClick={() => setSelectedContact(contact.id)}>
        <Card>
          {isEditable && (
            <Card.Body>
              <EdibaleLabel
                isEditable={true}
                label="Name"
                setter={setNewName}
                value={newName}
                WrapperComponent={Card.Title}
              />
              <Button onClick={() => handleEdit()}>Save</Button>
            </Card.Body>
          )}
          {!isEditable && (
            <Card.Body>
              <Card.Title style={{ fontWeight: selected ? "bold" : "normal" }}>
                {contact.name}
              </Card.Title>
              <div className="d-flex justify-content-start gap-3">
              <Card.Text>
                Email: {contact.email}
              </Card.Text>
              <Card.Text>
                Phone Number: {contact.phone_number}
              </Card.Text>
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <Button onClick={() => setIsEditable(!isEditable)}>
                    Edit
                  </Button>
                  <Button onClick={() => onDeleted(contact.id)}>Delete</Button>
                </div>
              </div>
            </Card.Body>
          )}
        </Card>
      </div>
    </ListGroupItem>
  );
}
