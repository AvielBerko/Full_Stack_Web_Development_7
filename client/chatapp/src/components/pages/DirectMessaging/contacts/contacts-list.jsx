import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col, Alert, Card} from "react-bootstrap";
import ContactsItem from "./contacts-item";
import {
  getContacts,
} from "../../../../api/contacts";
import {
  useQuery,
} from "@tanstack/react-query";
import AddContactModal from "./add-contact/add-contact-modal";
import BlockButton from "../../../common/BlockButton/block-button";

export default function ContactsList({ user, selectedContact, setSelectedContact}) {
  const CONTACTS_PER_PAGE = 10;
  
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [alert, setAlert] = useState("");

  if (!user?.id) return <></>;
  const contactsQuery = useQuery({
    queryKey: ["contacts", user.id],
    enabled: user?.id != undefined,
    queryFn: () => {
      return getContacts({}, user.token);
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setAlert(error.message);
    }
  });


  // useEffect(() => {
  //   handleSort();
  // }, [sortBy]);


  // TODO:
  // const postsDOM = postsQuery?.data?.pages
  // ?.reduce((prev, cur) => [...prev, ...cur], [])
  // .map((post) => (
  //   <PostItem
  //     key={post.id}
  //     post={post}
  //     deletePost={handleDeletePost}
  //     setAlert={setAlert}
  //     updatePost={handleUpdatePost}
  //   />
  // ));

  if (contactsQuery.isLoading) return <>Loading</>;
  //if (contactsQuery.isError) return <>Error</>;
  let contactsDOM = null;
  if (contactsQuery.data?.length) {
    contactsDOM = contactsQuery.data
      .map((contact) => (
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

  const alertDOM = (
    <Row>
      <Col>
        <Alert variant="danger" onAbort={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  const addContactModalDOM = (
      <AddContactModal
        user={user}
        showState={[showAddContactModal, setShowAddContactModal]}
        setFatherAlert={setAlert}
        contacts={contactsQuery.data}
        refetchContacts={contactsQuery.refetch}
        //setAlert={setAlert}
      />
  );

  return (
    <>
    {alert && alertDOM}
    {addContactModalDOM}
    <Card>
      <Card.Header>
    <Card.Title>
      My Contacts:
    </Card.Title>
    </Card.Header>
    </Card>
    <Card>
      <Card.Header>
      <BlockButton
        variant="primary"
        onClick={() => setShowAddContactModal(true)}
        >
        {" "}
        Add Contact
      </BlockButton>
      </Card.Header>
      {/* <Card.Body>
        <Card.Title>My Contacts: </Card.Title>
      </Card.Body> */}
       <div
        style={{
          backgroundColor: "#fff",
          height: "540px",
          // height: "100%",
          overflowY: "scroll",
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {contactsDOM ?? <>No data</>}
        </div>
      </Card>
    </>
  );
}
