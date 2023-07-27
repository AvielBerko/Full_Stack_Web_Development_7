import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col, Alert } from "react-bootstrap";
import GroupsItem from "./groups-item";
import {
  getGroups,
} from "../../../../api/groups";
import {
  useInfiniteQuery, useQuery,
} from "@tanstack/react-query";
import AddGroupModal from "./join-group/join-group-modal";
import BlockButton from "../../../common/BlockButton/block-button";

export default function GroupsList({ user, selectedGroup, setSelectedGroup}) {
  const GROUPS_PER_PAGE = 10;
  
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
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
    }
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
    groupsDOM = groupsQuery.data
      .map((group) => (
        <GroupsItem
          key={group.id}
          group={group}
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

  const addGroupModalDOM = (
    <ListGroupItem>
      <AddGroupModal
        user={user}
        showState={[showAddGroupModal, setShowAddGroupModal]}
        groups={groupsQuery.data}
        refetchGroups={groupsQuery.refetch}
        //setAlert={setAlert}
      />
    </ListGroupItem>
  );

  return (
    <ListGroup>
    {alert && alertDOM}
    <BlockButton
      variant="success"
      onClick={() => setShowAddGroupModal(true)}
    >
      {" "}
      Add Group
    </BlockButton>
    {addGroupModalDOM}
    {groupsDOM ?? <>No data</>}
  </ListGroup>
  );
}
