import React from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { useSession } from "../../custom-hooks/use-session";
import { useNavigate } from 'react-router-dom';

export default function TopNavbar() {
  const [auth, setAuth] = useSession("auth", null);

  const navigate = useNavigate(); 
  
  const logOut = () => {
    setAuth(null);
    navigate("/login", { replace: true });
  };

  const loggedInLinks = (
    <Nav className="me-auto">
      <Nav.Link href="/profile">Profile</Nav.Link>
      <Nav.Link href="/direct_messages">Direct Messages</Nav.Link>
      <Nav.Link href="/group_messages">Groups</Nav.Link>
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
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {auth ? loggedInLinks : loggedOutLinks}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}