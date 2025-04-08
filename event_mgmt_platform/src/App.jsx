import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth_context"; // Import AuthProvider & useAuth
import Home from "./pages/home";
import './App.css';
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import CreateEvent from "./pages/create_event";
import ManageEvent from "./pages/manage_event"
import Navbar from "./components/header";
import Footer from "./components/footer";
import EventDetails from "./pages/event_details";
import RSVPEvents from "./pages/rsvp-events";
import EventUsers  from "./pages/event_users";
import ForgotPassword from "./pages/reset-password";
import ResetPassword from "./pages/reset-password-confirm";

/**
 * Main application component.
 * 
 * Manages application routing and global authentication state using context.
 * Defines routes for various pages like Home, Login, Register, Dashboard, Event management, etc.
 * 
 * @component
 * @returns {JSX.Element} The main application component wrapped with layout and routing.
 */

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // Use Auth Context  

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Home />} />
          <Route path="/add_event" element={<CreateEvent />} /> 
          <Route path="/manage_event/:event_id" element={<ManageEvent />} />
          <Route path="/event_details/:event_id" element={<EventDetails />} />
          <Route path="/RSVPed_Events" element={<RSVPEvents />} />
          <Route path="/event/:event_id/users" element={<EventUsers />} />
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
