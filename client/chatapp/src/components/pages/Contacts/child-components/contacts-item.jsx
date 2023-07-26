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

  // const [showComments, setShowComments] = useState<Boolean>(false);
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
              {/* <Card.Text style={{ fontWeight: selected ? "bold" : "normal" }}>
                {postState.body}
              </Card.Text> */}
              <div className="d-flex justify-content-between">
                {/* <Button onClick={() => setShowComments(!showComments)}>
                  {showComments ? "Hide Comments" : "Show Comments"}
                </Button> */}
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

        {/* {showComments && <CommentsList post={postState} user={user} />} */}
      </div>
    </ListGroupItem>
  );
}
