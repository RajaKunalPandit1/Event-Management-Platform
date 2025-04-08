// import { Link, useNavigate } from "react-router-dom";
// import { Navbar, Nav, Container } from "react-bootstrap";

// const Header = ({ isAuthenticated, setAuth }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("username");
//     localStorage.removeItem("role");

//     setAuth(false); // Update authentication state
//     navigate("/"); // Redirect to home
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="me-auto">Event Management Platform</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             {isAuthenticated ? (
//               <>
//               <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
//               <Nav.Link onClick={handleLogout} style={{ cursor: "pointer"}}>
//                 Logout
//               </Nav.Link>
//               </>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/">Home</Nav.Link>
//                 <Nav.Link as={Link} to="/register">Register</Nav.Link>
//                 <Nav.Link as={Link} to="/login">Login</Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const Header = ({ isAuthenticated, setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is home
  const isHomePage = location.pathname === "/" || location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setAuth(false); // Update authentication state
    navigate("/"); // Redirect to home
  };

  return (
    <Navbar
      expand="lg"
      className={`px-3 ${isHomePage ? "navbar-transparent fixed-top" : "bg-dark"}`} // Dynamic styling
      variant="dark"
      fixed={isHomePage ? "top" : ""} // Fix navbar on home page
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          Event Management Platform
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Navbar, Nav, Container } from "react-bootstrap";
// import { useEffect, useState } from "react";

// const Header = ({ isAuthenticated, setAuth, filterComponent }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showFilterInNavbar, setShowFilterInNavbar] = useState(false);

//   // Handle scroll to show/hide filter component in navbar
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const carouselHeight = window.innerHeight * 0.7; // adjust based on your carousel height
//       if (scrollPosition > carouselHeight) {
//         setShowFilterInNavbar(true);
//       } else {
//         setShowFilterInNavbar(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("username");
//     localStorage.removeItem("role");

//     setAuth(false); // Update authentication state
//     navigate("/"); // Redirect to home
//   };

//   return (
//     <Navbar
//       expand="lg"
//       className="px-3 bg-dark fixed-top shadow-sm"
//       variant="dark"
//       style={{ transition: "all 0.4s ease" }}
//     >
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/" className="me-auto">
//           Event Management Platform
//         </Navbar.Brand>
//         {showFilterInNavbar && (
//           <div className="d-none d-md-block mx-auto">{filterComponent}</div>
//         )}
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             {isAuthenticated ? (
//               <>
//                 <Nav.Link as={Link} to="/dashboard">Home</Nav.Link>
//                 <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
//                   Logout
//                 </Nav.Link>
//               </>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/">Home</Nav.Link>
//                 <Nav.Link as={Link} to="/register">Register</Nav.Link>
//                 <Nav.Link as={Link} to="/login">Login</Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;