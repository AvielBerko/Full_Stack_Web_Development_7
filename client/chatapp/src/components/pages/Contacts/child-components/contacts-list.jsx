import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col, Alert } from "react-bootstrap";
import { useSession } from "../../../../custom-hooks/use-session";
import ContactsItem from "./contacts-item";
import { SortBy } from "../types";
import BlockButton from "../../../common/BlockButton/block-button";
import {
  deleteContact,
  getContacts,
  updateContact,
} from "../../../../api/contacts";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import AddContactModal from "./add-contact/add-contact-modal";

export default function ContactsList({ sortBy }) {
  const CONTACTS_PER_PAGE = 10;
  const [user, _] = useSession("auth", null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [alert, setAlert] = useState("");

  const queryClient = useQueryClient();
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

  const updateContactMutetion = useMutation({
    mutationFn: (contact) => updateContact(contact),
    onSettled: (results) => {
      if (typeof results === "string") {
        setAlert(results);
      } else {
        //contactsQuery.refetch();
        queryClient.setQueriesData(["contacts"], (oldData) => {
          const newData = oldData.pages.map((page) => {
            return page.map((contact) => {
              if (contact.id === results.id) {
                return results;
              }
              return contact;
            });
          });
          return { pages: newData };
        });
        //queryClient.invalidateQueries(["contacts"])
      }
    },
    onError: (error) => {
      setAlert("An unexpected error occurred. Please try again later.");
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (contactId) => deleteContact(contactId),
    onSuccess: (results) => {
      if (results === "") {
        // update the cache and remove the deleted contact

        queryClient.invalidateQueries(["contacts"]);
      } else {
        setAlert(results);
      }
    },
    onError: () => {
      setAlert("An unexpected error occurred. Please try again later.");
    },
  });

  const handleSort = () => {
    // let sortedContacts;
    // switch (sortBy) {
    //   case SortBy.NAME:
    //     sortedContacts = [...posts].sort((a, b) => {
    //       if (a.title && b.title) {
    //         return a.title.localeCompare(b.title);
    //       }
    //       return 0;
    //     });
    //     break;
    //   case SortBy.ID:
    //     sortedContacts = [...contactsQuery?.data].sort((a, b) => {
    //       if (a.id && b.id) {
    //         const idA = Number(a.id);
    //         const idB = Number(b.id);
    //         return idA - idB;
    //       }
    //       // Handle the case where either a.id or b.id is undefined
    //       return 0;
    //     });
    //     break;
    //   default:
    //     sortedContacts = contactsQuery?.data;
    //     break;
    // }
    // // setPosts(sortedPosts);
  };

  useEffect(() => {
    handleSort();
  }, [sortBy]);

  const handleUpdate = (contact) => {
    updateContactMutetion.mutate(contact);
  };

  const handleDelete = (contactID) => {
    deleteContactMutation.mutate(contactID);
  };

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
          onDeleted={handleDelete}
          onUpdated={handleUpdate}
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

  const addContactModalDOM = (
    <ListGroupItem>
      <AddContactModal
        user={user}
        showState={[showAddContactModal, setShowAddContactModal]}
        contacts={contactsQuery.data.pages[0]}
        refetchContacts={contactsQuery.refetch}
        //setAlert={setAlert}
      />
    </ListGroupItem>
  );

  return (
    <ListGroup>
      {alert && alertDOM}
      <BlockButton
        variant="success"
        onClick={() => setShowAddContactModal(true)}
      >
        {" "}
        Add Contact
      </BlockButton>
      {addContactModalDOM}
      {contactsDOM ?? <>No data</>}
    </ListGroup>
  );
}
