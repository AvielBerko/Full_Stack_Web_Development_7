import React, {useState} from "react";
import { ListGroupItem, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveGroup } from "../../../../../api/groups";

export default function GroupinfoUser({ user, member, setAlert}) {
  if (!member) return <></>;
  
  const admin = Boolean(user.admin);
  const queryClient = useQueryClient();

  const removeUserMutation = useMutation({
    mutationFn: () => leaveGroup(member.groupchat_id, member.user_id, user.token),
    onSuccess: (results) => {
      // Remove the user from the local cache to reflect the updated list of members
      queryClient.setQueryData(["groups", member.groupchat_id, 'members'], (oldData) => {
        const newData = oldData.filter((member) => {
          return member.user_id !== results.user_id;
        });
        return newData;
      });
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });


  
  return (
    <ListGroupItem>
        <Card>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <Card.Title>
              {member?.email}
              {Boolean(member?.admin) && (<span className="text-danger"> (Admin)</span>)}
            </Card.Title>
            {admin && (
            <Button
              variant="danger"
              onClick={() => {removeUserMutation.mutate()}}
            >
              Remove User
            </Button>
            )}
          </Card.Body>
        </Card>
    </ListGroupItem>
  );
}
