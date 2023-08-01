import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import ContactsItem from "./contacts-item";
import { getContacts } from "../../../../api/contacts";
import { useQuery } from "@tanstack/react-query";
import AddContactModal from "./add-contact/add-contact-modal";
import BlockButton from "../../../common/BlockButton/block-button";
import AlertComponent from "../../../common/AlertComponent/alert-component";
import "../../../../css/contacts.css"

export default function ContactsList({
  user,
  selectedContact,
  setSelectedContact,
}) {
  if (!user?.id) return <></>;

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [alert, setAlert] = useState("");

  const contactsQuery = useQuery({
    queryKey: ["contacts", user.id],
    enabled: user?.id != undefined,
    queryFn: () => {
      return getContacts({}, user.token);
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setAlert(error.message);
    },
  });

  if (contactsQuery.isLoading) return <>Loading</>;
  let contactsDOM = null;
  if (contactsQuery.data?.length) {
    contactsDOM = contactsQuery.data.map((contact) => (
      <ContactsItem
        key={contact.id}
        contact={contact}
        user={user}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        setAlert={setAlert}
      />
    ));
  }

  const addContactModalDOM = (
    <AddContactModal
      user={user}
      showState={[showAddContactModal, setShowAddContactModal]}
      setFatherAlert={setAlert}
      contacts={contactsQuery.data}
      refetchContacts={contactsQuery.refetch}
    />
  );

  return (
    <>
      {alert && <AlertComponent alert={alert} setAlert={setAlert} />}
      {addContactModalDOM}
      <Card>
        <Card.Header>
          <Card.Title>My Contacts:</Card.Title>
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <BlockButton
            variant="primary"
            onClick={() => setShowAddContactModal(true)}
          >
            Add Contact
          </BlockButton>
        </Card.Header>

        <div className="contacts-list">
          {contactsDOM ?? <>No data</>}
        </div>
      </Card>
    </>
  );
}
