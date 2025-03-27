// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Button, ListGroup, Card } from "react-bootstrap";
// import axios from "axios";

// const Dashboard = () => {
//     const [username, setUsername] = useState("");
//     const [role, setRole] = useState("");
//     const [events, setEvents] = useState([]);
//     const navigate = useNavigate();

//     // Load user info from localStorage on mount
//     useEffect(() => {
//         const storedUsername = localStorage.getItem("username");
//         const storedRole = localStorage.getItem("role");
//         const accessToken = localStorage.getItem("access_token");
        
//         if (storedUsername) setUsername(storedUsername);
//         if (storedRole) setRole(storedRole);
        
//         if (accessToken) {
//             fetchEvents(accessToken);
//         }
//     }, []);

//     const fetchEvents = async (token) => {
//         try {
//             const response = await axios.get("http://127.0.0.1:8000/api/my_events/", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setEvents(response.data);
//         } catch (error) {
//             console.error("Error fetching events:", error);
//         }
//     };

//     return (
//         <Container className="d-flex flex-column align-items-center mt-5">
//             <h1>Welcome, {username} to your dashboard!</h1>
            
//             {/* Show "Add Event" only for Admins */}
//             {role === "admin" && (
//                 <Button variant="primary" className="mb-3" onClick={() => navigate("/add_event")}>
//                     Add Event
//                 </Button>
//             )}

//             <Card className="w-75 p-3 shadow">
//                 <h3>Your Events:</h3>
//                 {events.length === 0 ? (
//                     <p className="text-center text-muted">Your events will be displayed here.</p>
//                 ) : (
//                     <ListGroup>
//                         {events.map((event) => (
//                             <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
//                                 {event.title}
//                                 <Button variant="warning" onClick={() => navigate(`/manage_event/${event.id}`)}>
//                                     Update
//                                 </Button>
//                             </ListGroup.Item>
//                         ))}
//                     </ListGroup>
//                 )}
//             </Card>
//         </Container>
//     );
// };

// export default Dashboard;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Container, Button, ListGroup, Card, Toast } from "react-bootstrap";
// import axios from "axios";

// const Dashboard = () => {
//     const [username, setUsername] = useState("");
//     const [role, setRole] = useState("");
//     const [events, setEvents] = useState([]);
//     const [rsvpedEvents, setRsvpedEvents] = useState(new Set()); // Store RSVP'ed event IDs
//     const [showToast, setShowToast] = useState(true); // Snackbar state
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedUsername = localStorage.getItem("username");
//         const storedRole = localStorage.getItem("role");
//         const accessToken = localStorage.getItem("access_token");

//         if (storedUsername) setUsername(storedUsername);
//         if (storedRole) setRole(storedRole);

//         if (accessToken) {
//             if (storedRole === "admin") {
//                 fetchAdminEvents(accessToken);
//             } else {
//                 fetchAllEvents(accessToken);
//                 fetchRsvpedEvents(accessToken);
//             }
//         }
//     }, []);

//     const fetchAdminEvents = async (token) => {
//         try {
//             const response = await axios.get("http://127.0.0.1:8000/api/my_events/", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setEvents(response.data);
//         } catch (error) {
//             console.error("Error fetching admin events:", error);
//         }
//     };

//     const fetchAllEvents = async (token) => {
//         try {
//             const response = await axios.get("http://127.0.0.1:8000/api/events/", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setEvents(response.data);
//         } catch (error) {
//             console.error("Error fetching all events:", error);
//         }
//     };

//     const fetchRsvpedEvents = async (token) => {
//         try {
//             const response = await axios.get("http://127.0.0.1:8000/api/my_rsvp_events/", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const rsvpedEventIds = new Set(response.data.map(event => event.id));
//             setRsvpedEvents(rsvpedEventIds); // Store RSVP-ed events
//         } catch (error) {
//             console.error("Error fetching RSVP-ed events:", error);
//         }
//     };

//     const handleRsvpToggle = async (eventId) => {
//         const token = localStorage.getItem("access_token");
//         if (!token) return;

//         const isRsvped = rsvpedEvents.has(eventId);
//         const url = isRsvped
//             ? `http://127.0.0.1:8000/api/event/${eventId}/remove-rsvp/`
//             : `http://127.0.0.1:8000/api/event/${eventId}/rsvp/`;

//         try {
//             await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

//             setRsvpedEvents((prev) => {
//                 const updatedRsvps = new Set(prev);
//                 if (isRsvped) {
//                     updatedRsvps.delete(eventId);
//                 } else {
//                     updatedRsvps.add(eventId);
//                 }
//                 return updatedRsvps;
//             });
//         } catch (error) {
//             console.error(`Error ${isRsvped ? "removing RSVP" : "RSVPing"}:`, error);
//         }
//     };

//     return (
//         <Container className="d-flex flex-column align-items-center mt-5">
//             {/* Centered Snackbar */}
//             {/* <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1050 }}>
//                 <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-light shadow">
//                     <Toast.Header>
//                         <strong className="me-auto">Welcome</strong>
//                         <Button variant="close" onClick={() => setShowToast(false)}>✖</Button>
//                     </Toast.Header>
//                     <Toast.Body className="text-center">Hello, {username}! Enjoy your events.</Toast.Body>
//                 </Toast>
//             </div> */}
//             <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
//                 <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-success text-white shadow">
//                     <Toast.Header closeButton={false} className="bg-success text-white">
//                         <strong className="me-auto">Welcome {username}! Enjoy the events.</strong>
//                         <Button variant="outline-light" size="sm" onClick={() => setShowToast(false)}>✖</Button>
//                     </Toast.Header>
//                 </Toast>
//             </div>


//             {role === "admin" ? (
//                 <Button variant="primary" className="mb-3" onClick={() => navigate("/add_event")}>
//                     Add Event
//                 </Button>
//             ) : (
//                 <Button variant="info" className="mb-3" onClick={() => navigate("/rsvped_events")}>
//                     RSVPed Events
//                 </Button>
//             )}

//             <Card className="w-75 p-3 shadow">
//                 <h3>{role === "admin" ? "Your Events:" : "Available Events:"}</h3>
//                 {events.length === 0 ? (
//                     <p className="text-center text-muted">No events found.</p>
//                 ) : (
//                     <ListGroup>
//                         {events.map((event) => (
//                             <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
//                                 {event.title}
//                                 {role === "admin" ? (
//                                     <Button variant="warning" onClick={() => navigate(`/manage_event/${event.id}`)}>
//                                         Update
//                                     </Button>
//                                 ) : (
//                                     <Button
//                                         variant={rsvpedEvents.has(event.id) ? "danger" : "success"}
//                                         onClick={() => handleRsvpToggle(event.id)}
//                                     >
//                                         {rsvpedEvents.has(event.id) ? "Cancel RSVP" : "RSVP"}
//                                     </Button>
//                                 )}
//                             </ListGroup.Item>
//                         ))}
//                     </ListGroup>
//                 )}
//             </Card>
//         </Container>
//     );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, ListGroup, Card, Toast } from "react-bootstrap";
import axios from "axios";
import EventCarousel from "./event_carousel"; // Import the Carousel

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [events, setEvents] = useState([]);
    const [rsvpedEvents, setRsvpedEvents] = useState(new Set()); // Store RSVP'ed event IDs
    const [showToast, setShowToast] = useState(true); // Snackbar state
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const accessToken = localStorage.getItem("access_token");

        if (storedUsername) setUsername(storedUsername);
        if (storedRole) setRole(storedRole);

        if (accessToken) {
            if (storedRole === "admin") {
                fetchAdminEvents(accessToken);
            } else {
                fetchAllEvents(accessToken);
                fetchRsvpedEvents(accessToken);
            }
        }
    }, []);

    const fetchAdminEvents = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/my_events/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching admin events:", error);
        }
    };

    const fetchAllEvents = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching all events:", error);
        }
    };

    const fetchRsvpedEvents = async (token) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/my_rsvp_events/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const rsvpedEventIds = new Set(response.data.events.map(event => event.id));
            setRsvpedEvents(rsvpedEventIds);
        } catch (error) {
            console.error("Error fetching RSVP-ed events:", error);
        }
    };

    const handleRsvpToggle = async (eventId) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const isRsvped = rsvpedEvents.has(eventId);
        const url = isRsvped
            ? `http://127.0.0.1:8000/api/event/${eventId}/remove-rsvp/`
            : `http://127.0.0.1:8000/api/event/${eventId}/rsvp/`;

        try {
            await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

            setRsvpedEvents((prev) => {
                const updatedRsvps = new Set(prev);
                if (isRsvped) {
                    updatedRsvps.delete(eventId);
                } else {
                    updatedRsvps.add(eventId);
                }
                return updatedRsvps;
            });
        } catch (error) {
            console.error(`Error ${isRsvped ? "removing RSVP" : "RSVPing"}:`, error);
        }
    };

    return (
        <>
            {/* Insert Carousel at the Top */}
            <EventCarousel />

            <Container className="d-flex flex-column align-items-center mt-3">
                {/* Welcome Toast */}
                <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
                    <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-success text-white shadow">
                        <Toast.Header closeButton={false} className="bg-success text-white">
                            <strong className="me-auto">Welcome {username}! Enjoy the events.</strong>
                            <Button variant="outline-light" size="sm" onClick={() => setShowToast(false)}>✖</Button>
                        </Toast.Header>
                    </Toast>
                </div>

                {role === "admin" ? (
                    <Button variant="primary" className="mb-3" onClick={() => navigate("/add_event")}>
                        Add Event
                    </Button>
                ) : (
                    <Button variant="info" className="mb-3" onClick={() => navigate("/rsvped_events")}>
                        RSVPed Events
                    </Button>
                )}

                <Card className="w-75 p-3 shadow">
                    <h3>{role === "admin" ? "Your Events:" : "Available Events:"}</h3>
                    {events.length === 0 ? (
                        <p className="text-center text-muted">No events found.</p>
                    ) : (
                        <ListGroup>
                            {events.map((event) => (
                                <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
                                    {event.title}
                                    {role === "admin" ? (
                                        <Button variant="warning" onClick={() => navigate(`/manage_event/${event.id}`)}>
                                            Update
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={rsvpedEvents.has(event.id) ? "danger" : "success"}
                                            onClick={() => handleRsvpToggle(event.id)}
                                        >
                                            {rsvpedEvents.has(event.id) ? "Cancel RSVP" : "RSVP"}
                                        </Button>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card>
            </Container>
        </>
    );
};

export default Dashboard;