import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const Header = ({ isAuthenticated }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Event Management Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
