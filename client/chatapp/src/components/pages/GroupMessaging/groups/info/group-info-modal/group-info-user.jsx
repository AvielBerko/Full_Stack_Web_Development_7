import React, {useState} from "react";
import { ListGroupItem, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveGroup, setGroupAdmin } from "../../../../../../api/groups";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function GroupinfoUser({ user, member, setAlert}) {
  if (!member) return <></>;
  
  const admin = Boolean(user.admin);
  const queryClient = useQueryClient();

  const removeUserMutation = useMutation({
    mutationFn: () => leaveGroup(member.groupchat_id, member.user_id, user.token),
    onSuccess: (results) => {
      queryClient.invalidateQueries(["groups", member.groupchat_id, 'members']);
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
        <Card>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <Card.Title>
              {member?.email}
              {Boolean(member?.admin) && (<span className="text-danger"> (Admin)</span>)}
            </Card.Title>
            <div className="d-flex gap-2">
            {admin && Boolean(member?.admin) && member.user_id != user.id && (
              <Button
                variant="danger"
                onClick={() => {updateAdminMutation.mutate({admin: false})}}
              >
                DeAdmatize
              </Button>
            )}
            {admin && !Boolean(member?.admin) && member.user_id != user.id && (
              <Button
                variant="primary"
                onClick={() => {updateAdminMutation.mutate({admin: true})}}
              >
                Admatize
              </Button>
            )}
            {admin && member.user_id != user.id && (
            <Button
              variant="danger"
              onClick={() => {removeUserMutation.mutate()}}
            >
              <FontAwesomeIcon icon={faTrash}/>
            </Button>
            )}
            </div>
          </Card.Body>
        </Card>
  );
}
