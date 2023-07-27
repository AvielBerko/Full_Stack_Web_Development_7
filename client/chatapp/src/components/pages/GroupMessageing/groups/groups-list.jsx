import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Alert,
  Container,
} from "react-bootstrap";
import GroupsItem from "./groups-item";
import { getGroups } from "../../../../api/groups";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import JoinGroupModal from "./join-group/join-group-modal";
import BlockButton from "../../../common/BlockButton/block-button";
import AddGroupModal from "./add-group/add-group-modal";

export default function GroupsList({ user, selectedGroup, setSelectedGroup }) {
  const GROUPS_PER_PAGE = 10;

  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [alert, setAlert] = useState("");  

  if (!user?.id) return <></>;

  const groupsQuery = useQuery({
    queryKey: ["groups", user.id],
    enabled: user?.id != undefined,
    queryFn: () => {
      return getGroups(user.id);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      setAlert(error.message);
    },
  });

  // const groupsQuery = useInfiniteQuery({
  //   queryKey: ["groups", user.id],
  //   enabled: user?.id != undefined,
  //   queryFn: ({ pageParam = 0 }) => {
  //     const start = pageParam;
  //     //TODO return getGroups(user.id, start, start + CONTACTS_PER_PAGE);
  //     return getGroups(user.id);
  //   },
  //   getNextPageParam: (lastPage, allPages) => {
  //     if (allPages.length >= 2 && lastPage.length == 0) {
  //       return undefined;
  //     }
  //     const allPagesCount = allPages.reduce(
  //       (prev, cur) => prev + cur.length,
  //       0
  //     );
  //     return allPagesCount;
  //   },
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  //   onError: (error) => {
  //     setAlert(error.message);
  //   }
  // });

  // const handleSort = () => {
  //   // let sortedGroups;
  //   // switch (sortBy) {
  //   //   case SortBy.NAME:
  //   //     sortedGroups = [...posts].sort((a, b) => {
  //   //       if (a.title && b.title) {
  //   //         return a.title.localeCompare(b.title);
  //   //       }
  //   //       return 0;
  //   //     });
  //   //     break;
  //   //   case SortBy.ID:
  //   //     sortedGroups = [...groupsQuery?.data].sort((a, b) => {
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
  //   //     sortedGroups = groupsQuery?.data;
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

  if (groupsQuery.isLoading) return <>Loading</>;
  if (groupsQuery.isError) return <>Error</>;
  let groupsDOM = null;
  if (groupsQuery.data?.length) {
    groupsDOM = groupsQuery.data.map((group) => (
      <GroupsItem
        key={group.id}
        group={group}
        user={user}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
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

  const joinGroupModalDOM = (
      <JoinGroupModal
        user={user}
        showState={[showJoinGroupModal, setShowJoinGroupModal]}
        userGroups={groupsQuery.data}
        refetchGroups={groupsQuery.refetch}
        //setAlert={setAlert}
      />
  );

  const addGroupModalDOM = (
      <AddGroupModal
        user={user}
        showState={[showAddGroupModal, setShowAddGroupModal]}
        refetchGroups={groupsQuery.refetch}
      />
  );


  return (
    <ListGroup>
      {alert && alertDOM}
      <Container>
        <Row>
          <Col>
            <BlockButton
              variant="success"
              onClick={() => setShowAddGroupModal(true)}
            >
              {" "}
              New Group
            </BlockButton>
          </Col>
          <Col>
            <BlockButton
              variant="success"
              onClick={() => setShowJoinGroupModal(true)}
            >
              {" "}
              Join Group
            </BlockButton>
          </Col>
        </Row>
      </Container>
      {joinGroupModalDOM}
      {addGroupModalDOM}
      {groupsDOM ?? <>No data</>}
    </ListGroup>
  );
}
