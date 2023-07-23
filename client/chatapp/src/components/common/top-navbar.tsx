import React from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { useSession } from "../../custom-hooks/use-session";

export default function TopNavbar() {
  const [user, setUser] = useSession("auth", null);

  const logOut = () => {
    setUser(null);
  };

  const loggedInLinks = (
    <Nav className="me-auto">
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href="/info">Info</Nav.Link>
      <Nav.Link href="/todos">Todos</Nav.Link>
      <Nav.Link href="/posts">Posts</Nav.Link>
      <Nav.Link href="/albums">Albums</Nav.Link>
      <Nav.Link href="#" onClick={logOut}>
        Logout
      </Nav.Link>
    </Nav>
  );

  const loggedOutLinks = (
    <Nav className="me-auto">
      <Nav.Link href="/login">Login</Nav.Link>
      <Nav.Link href="/register">Register</Nav.Link>
    </Nav>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Container>{user ? loggedInLinks : loggedOutLinks}</Container>
    </Navbar>
  );
}
