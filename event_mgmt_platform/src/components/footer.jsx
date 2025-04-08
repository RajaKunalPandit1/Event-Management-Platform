// import { Container } from "react-bootstrap";

// const Footer = () => {
//   return (
//     <footer className="footer bg-dark py-3 mt-auto">
//       <Container className="text-center">
//         <span className="text-white">&copy; All rights reserved</span>
//       </Container>
//     </footer>
//   );
// };

// export default Footer;


import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  
  // If on the home page, don't render the footer
  if (location.pathname === "/") {
    return null;
  }

  return (
    <footer className="footer py-3 text-center bg-dark">
      <Container>
        <span className="text-white">&copy; All rights reserved</span>
      </Container>
    </footer>
  );
};

export default Footer;
