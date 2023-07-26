import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col, Alert } from "react-bootstrap";
import ContactsItem from "./contacts-item";
import {
  getContacts,
} from "../../../../api/contacts";
import {
  useInfiniteQuery,
} from "@tanstack/react-query";

export default function ContactsList({ user, selectedContact, setSelectedContact}) {
  const CONTACTS_PER_PAGE = 10;
  const [alert, setAlert] = useState("");

  if (!user?.id) return <></>;
  const contactsQuery = useInfiniteQuery({
    queryKey: ["contacts", user.id],
    enabled: user?.id != undefined,
    queryFn: ({ pageParam = 0 }) => {
      const start = pageParam;
      //TODO return getContacts(user.id, start, start + CONTACTS_PER_PAGE);
      return getContacts(user.id);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length >= 2 && lastPage.length == 0) {
        return undefined;
      }
      const allPagesCount = allPages.reduce(
        (prev, cur) => prev + cur.length,
        0
      );
      return allPagesCount;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // const handleSort = () => {
  //   // let sortedContacts;
  //   // switch (sortBy) {
  //   //   case SortBy.NAME:
  //   //     sortedContacts = [...posts].sort((a, b) => {
  //   //       if (a.title && b.title) {
  //   //         return a.title.localeCompare(b.title);
  //   //       }
  //   //       return 0;
  //   //     });
  //   //     break;
  //   //   case SortBy.ID:
  //   //     sortedContacts = [...contactsQuery?.data].sort((a, b) => {
  //   //       if (a.id && b.id) {
  //   //         const idA = Number(a.id);
  //   //         const idB = Number(b.id);
  //   //         return idA - idB;
  //   //       }
  //   //       // Handle the case where either a.id or b.id is undefined
  //   //       return 0;
  //   //     });
  //   //     break;
  //   //   default:
  //   //     sortedContacts = contactsQuery?.data;
  //   //     break;
  //   // }
  //   // // setPosts(sortedPosts);
  // };

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
  if (contactsQuery.isError) return <>Error</>;

  let contactsDOM = null;
  if (contactsQuery.data.pages[0].length) {
    contactsDOM = contactsQuery.data.pages
      ?.reduce((prev, cur) => [...prev, ...cur], [])
      .map((contact) => (
        <ContactsItem
          key={contact.id}
          user={user}
          contact={contact}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
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

  return (
    <ListGroup>
      {alert && alertDOM}
      {contactsDOM ?? <>No data</>}
    </ListGroup>
  );
}
