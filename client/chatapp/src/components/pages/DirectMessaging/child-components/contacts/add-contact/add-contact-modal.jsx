import React, { useState } from "react";
import { Button, FormControl, FormLabel, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import UserItem from "./user-item";
import { addContact } from "../../../../../../api/contacts";
import { getUsers } from "../../../../../../api/users";
import { useQuery, useMutation} from "@tanstack/react-query";

export default function AddContactModal({ user, showState, contacts, refetchContacts/*setAlert*/}) {
    const [name, setName] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [show, setShow] = showState;
  
    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: () => {
          return getUsers();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
      });

      const addContactMutation = useMutation({
        mutationFn: (contact) => addContact(contact),
        onSuccess: (results) => {
          if (typeof results === "string") {
            window.alert(results);
          } else {
            refetchContacts();
          }
        },
        onError: (error) => {
          alert("Unexpected error occurred. Please try again later.");
        },
      });

      const create = () => {
        if (!name) {
          alert("Please write a name.")
          return;
        }
        if (!selectedUser) {
          alert("Please select a user.")
          //setAlert("Please select a user.");
          return;
        }
        addContactMutation.mutate({ name, user_id: selectedUser, saver_id: user.id });
        setName("");
        setSelectedUser(null);
        setShow(false);
      };

      if (usersQuery.isLoading) return <>Loading</>;
      if (usersQuery.isError) return <>Error</>;
      if (!usersQuery.data.length) return <>No data</>;
      // add a filter to remove the users that are already contacts
      // filter also the current user
      const usersDOM = usersQuery?.data?.filter((u) => {
        // filter the current user
        if (u.id === user.id) return false;
        // filter the users that are already contacts
        return !contacts.some((contact) => contact.user_id === u.id);

      }).map((user) => {
          return (
            <UserItem
              key={user.id}
              user={user}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          );
        });
    
    return (
      <Modal show={show}>
        <ModalHeader>Add Contact</ModalHeader>
        <ModalBody>
          <FormLabel>Name</FormLabel>
          <InputGroup>
            <FormControl
              placeholder="Write here the Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
        {usersDOM}
        </ModalBody>
        <ModalFooter>
          <Button disabled={selectedUser == null || name === ""} variant={selectedUser != null && name != "" ? "success" : "dark"} onClick={create}>
            Add Contact
          </Button>
          <Button variant="danger" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
}