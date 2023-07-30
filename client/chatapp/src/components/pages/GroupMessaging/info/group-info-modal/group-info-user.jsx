import React, {useState} from "react";
import { ListGroupItem, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveGroup, setGroupAdmin } from "../../../../../api/groups";

export default function GroupinfoUser({ user, member, setAlert}) {
  if (!member) return <></>;
  
  const admin = Boolean(user.admin);
  const queryClient = useQueryClient();

  const removeUserMutation = useMutation({
    mutationFn: () => leaveGroup(member.groupchat_id, member.user_id, user.token),
    onSuccess: (results) => {
      queryClient.invalidateQueries(["groups", member.groupchat_id, 'members']);
      // Remove the user from the local cache to reflect the updated list of members
      // queryClient.setQueryData(["groups", member.groupchat_id, 'members'], (oldData) => {
      //   const newData = oldData.filter((member) => {
      //     return member.user_id !== results.user_id;
      //   });
      //   return newData;
      // });
      // if (results.user_id === user.id) {
      //   queryClient.invalidateQueries(["groups", 'user_id', user.id]);
      // }
    },
    onError: (error) => {
      setAlert(error.message);
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: (data) => {
      return setGroupAdmin(member.groupchat_id, member.id, data, user.token);
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries(["groups", member.groupchat_id, 'members']);
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
            {admin && Boolean(member?.admin) && member.user_id != user.id && (
              <Button
                variant="danger"
                onClick={() => {updateAdminMutation.mutate({admin: false})}}
              >
                Remove Admin
              </Button>
            )}
            {admin && !Boolean(member?.admin) && member.user_id != user.id && (
              <Button
                variant="success"
                onClick={() => {updateAdminMutation.mutate({admin: true})}}
              >
                Make Admin
              </Button>
            )}
            {admin && member.user_id != user.id && (
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
