// import { useState, useEffect } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import Home from "./pages/home";
// import Login from "./pages/login";
// import Register from "./pages/register";
// import ResetPassword from "./pages/reset-password";
// // import ResetPasswordConfirm from "./pages/reset-password-confirm";
// import Dashboard from "./pages/dashboard";
// import Navbar from "./components/header";
// import Footer from "./components/footer";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // Check if the user is already logged in on page load
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     setIsAuthenticated(!!token);
//   }, []);

//   // Redirect to dashboard if authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, navigate]); // ensures the effect runs whenever either value changes.

//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <Navbar isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} /> 
//       <div className="flex-grow-1">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           {/* <Route path="/reset-password-confirm/:userId/:token" element={<ResetPasswordConfirm />} /> */}
//           {isAuthenticated && <Route path="/dashboard" element={<Dashboard />} />}
//         </Routes>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth_context"; // Import AuthProvider & useAuth
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ResetPassword from "./pages/reset-password";
// import ResetPasswordConfirm from "./pages/reset-password-confirm";
import Dashboard from "./pages/dashboard";
import CreateEvent from "./pages/create_event";
import ManageEvent from "./pages/manage_event"
import Navbar from "./components/header";
import Footer from "./components/footer";
import EventDetails from "./pages/event_details";
import RSVPEvents from "./pages/rsvp-events";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // Use Auth Context
  const navigate = useNavigate();

  // Redirect to dashboard if authenticated
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated,navigate]);  

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/reset-password-confirm/:userId/:token" element={<ResetPasswordConfirm />} /> */}
          {/* {isAuthenticated && <Route path="/dashboard" element={<Dashboard />} />} */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Home />} />
          <Route path="/add_event" element={<CreateEvent />} /> 
          <Route path="/manage_event/:event_id" element={<ManageEvent />} />
          <Route path="/event_details/:eventId" element={<EventDetails />} />
          <Route path="/RSVPed_Events" element={<RSVPEvents />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

// Wrap the App component with AuthProvider
export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
