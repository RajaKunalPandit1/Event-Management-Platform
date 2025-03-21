import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register"; 
import ResetPassword from "./pages/reset-password";
import Navbar from "./components/header"; 
import Footer from "./components/footer";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100"> {/* Full viewport height */}
      <Navbar /> {/* Navigation */}
      <div className="flex-grow-1"> {/* Ensures content pushes footer down */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
      <Footer /> {/* Footer at the bottom */}
    </div>
  );
}

export default App;