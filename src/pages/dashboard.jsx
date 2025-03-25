// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate(); // For redirection

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     const token = localStorage.getItem("access_token"); // Check authentication

//     if (!token) {
//       navigate("/home"); // Redirect if not authenticated
//     } else if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, [navigate]); // Dependency array ensures effect runs once on mount

//   return (
//     <div className="d-flex flex-column justify-content-center align-items-center vh-100">
//       <h1>Welcome, {username} to your dashboard!</h1>
//       <p>This is your dashboard.</p>
//     </div>
//   );
// };

// export default Dashboard;


// import { useState, useEffect } from "react";

// const Dashboard = () => {
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

//   return (
//     <div className="d-flex flex-column justify-content-center align-items-center vh-100">
//       <h1>Welcome, {username} to your dashboard!</h1>
//       <p>This is your dashboard.</p>
//     </div>
//   );
// };

// // export default Dashboard;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";


// const Dashboard = () => {
    
//     const [username, setUsername] = useState("");
//     const [role, setRole] = useState("");
//     const navigate = useNavigate();


//     useEffect(() => {
//         const storedUsername = localStorage.getItem("username");
//         const storedRole = localStorage.getItem("role");

//         if (storedUsername) {
//             setUsername(storedUsername);
//         }
//         if (storedRole) {
//             setRole(storedRole);
//         }
//     }, []);

//     return (
//         <div className="d-flex flex-column justify-content-center align-items-center vh-100">
//             <h1>Welcome, {username} to your dashboard!</h1>
//             <p>This is your dashboard.</p>

//             {/* Show "Add Event" only for Admins */}
//             {role === "admin" && (
//                 <button className="btn btn-primary" onClick={() => navigate("/add_event")}>Add Event</button>
//             )}

//             <div className="mt-3">
//                 <h3>Your Events:</h3>
//                 <ul>
//                     <li>RSVPed Events</li>
//                     <li>Invited Events</li>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, ListGroup, Card } from "react-bootstrap";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [events, setEvents] = useState([]); // State for storing events
    const navigate = useNavigate();

    // Load user info from localStorage on mount
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (storedUsername) setUsername(storedUsername);
        if (storedRole) setRole(storedRole);
    }, []);

    return (
        <Container className="d-flex flex-column align-items-center mt-5">
            <h1>Welcome, {username} to your dashboard!</h1>
            <p>This is your dashboard.</p>

            {/* Show "Add Event" only for Admins */}
            {role === "admin" && (
                <Button variant="primary" className="mb-3" onClick={() => navigate("/add_event")}>
                    Add Event
                </Button>
            )}

            <Card className="w-75 p-3 shadow">
                <h3>Your Events:</h3>
                {events.length === 0 ? (
                    <p className="text-center text-muted">Your events will be displayed here.</p>
                ) : (
                    <ListGroup>
                        {events.map((event) => (
                            <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
                                {event.title}
                                <Button variant="warning" onClick={() => navigate(`/manage_event/${event.id}`)}>
                                    Update
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card>
        </Container>
    );
};

export default Dashboard;
