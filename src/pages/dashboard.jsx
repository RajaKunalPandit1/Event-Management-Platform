import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, ListGroup, Card, Toast, Form, Row, Col, InputGroup, Pagination, Dropdown} from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import EventCarousel from "./event_carousel";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [events, setEvents] = useState([]);
    const [rsvpedEvents, setRsvpedEvents] = useState(new Set());
    const [showToast, setShowToast] = useState(true);
    const navigate = useNavigate();

    const [dateFilter, setDateFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

    useEffect(() => {
        fetchEvents();
    }, [dateFilter, locationFilter]);

    const fetchEvents = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { date: dateFilter, location: locationFilter },
            });
            setEvents(response.data);
            setCurrentPage(1); // Reset to first page on new fetch
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const accessToken = localStorage.getItem("access_token");

        if (storedUsername) setUsername(storedUsername);
        if (storedRole) setRole(storedRole);

        if (accessToken) {
            if (storedRole !== "admin") {
                fetchAllEvents(accessToken);
                fetchRsvpedEvents(accessToken);
            } else {
                fetchAllEvents(accessToken);
                fetchAdminEvents(accessToken);
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
    
            console.log("API Response:", response.data); // Debugging
    
            // Extract event IDs from all RSVP statuses
            const goingEvents = response.data?.going || [];
            const notGoingEvents = response.data?.not_going || [];
            const maybeEvents = response.data?.maybe || [];
    
            // Combine all event IDs into a Set
            const rsvpedEventIds = new Set([
                ...goingEvents.map(event => event.id),
                ...notGoingEvents.map(event => event.id),
                ...maybeEvents.map(event => event.id),
            ]);
    
            setRsvpedEvents(rsvpedEventIds);
        } catch (error) {
            console.error("Error fetching RSVP-ed events:", error);
        }
    };   

    const handleRsvpToggle = async (eventId, status = "maybe") => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
    
        const isRsvped = rsvpedEvents.has(eventId);
    
        try {
            if (isRsvped) {
                // Change to DELETE request
                await axios.delete(`http://127.0.0.1:8000/api/event/${eventId}/remove-rsvp/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setRsvpedEvents((prev) => {
                    const updatedRsvps = new Set(prev);
                    updatedRsvps.delete(eventId);
                    return updatedRsvps;
                });
            } else {
                // RSVP with POST request
                await axios.post(`http://127.0.0.1:8000/api/event/${eventId}/rsvp/`, { status }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                setRsvpedEvents((prev) => {
                    const updatedRsvps = new Set(prev);
                    updatedRsvps.add(eventId);
                    return updatedRsvps;
                });
            }
        } catch (error) {
            console.error(`Error ${isRsvped ? "removing RSVP" : "RSVPing"}:`, error);
        }
    };    


    // ** Pagination Logic **
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const totalPages = Math.ceil(events.length / eventsPerPage);

    return (
        <>
            <EventCarousel />

            <Container className="d-flex flex-column align-items-center mt-3 mb-5">
                <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
                    <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-success text-white shadow">
                        <Toast.Header closeButton={false} className="bg-success text-white">
                            <strong className="me-auto">Welcome {username}! Enjoy the events.</strong>
                            <Button variant="outline-light" size="sm" onClick={() => setShowToast(false)}>✖</Button>
                        </Toast.Header>
                    </Toast>
                </div>
                <div className="search-bar-container d-flex align-items-center">
                    <InputGroup className="search-bar flex-grow-1">
                        <InputGroup.Text className="icon"><FaMapMarkerAlt /></InputGroup.Text>
                        <Form.Control 
                            type="text" 
                            placeholder="City or Location" 
                            value={locationFilter} 
                            onChange={(e) => setLocationFilter(e.target.value)}
                        />
                        <InputGroup.Text className="icon"><FaCalendarAlt /></InputGroup.Text>
                        <Form.Control 
                            type="date" 
                            value={dateFilter} 
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </InputGroup>
                    <Button 
                        variant={role === "admin" ? "primary" : "info"} 
                        className="ms-2 px-3 text-nowrap"
                        onClick={() => navigate(role === "admin" ? "/add_event" : "/rsvped_events")}
                    >
                        {role === "admin" ? "Add Event" : "Joined Events"}
                    </Button>
                </div>
                <div className="container mt-4">
                    <h3>{role === "admin" ? "Your Events:" : "Available Events:"}</h3>

                    {currentEvents.length === 0 ? (
                        <p className="text-center text-muted">No events found.</p>
                    ) : (
                        <Row>
                            {currentEvents.map((event) => (
                                <Col key={event.id} md={4} className="mb-4">
                                    <Card className="shadow">
                                        <Card.Img
                                            variant="top"
                                            src={event.image ? `http://127.0.0.1:8000${event.image}` : "https://images.unsplash.com/photo-1535041195258-607127544040?q=80&w=2070&auto=format&fit=crop"}
                                            alt={event.title}
                                            style={{ height: "250px", objectFit: "cover" }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{event.title}</Card.Title>
                                            <Card.Text>
                                                <strong>Description:</strong> {event.description} <br />
                                                <strong>Date:</strong> {event.date.split("T")[0]} <br />
                                                <strong>Location:</strong> {event.location} <br />
                                            </Card.Text>

                                            {role === "admin" ? (
                                                <div className="d-flex justify-content-between">
                                                    <Button variant="primary" onClick={() => navigate(`/manage_event/${event.id}`)}>
                                                        Update Event
                                                    </Button>
                                                    <Button 
                                                        variant="secondary" 
                                                        onClick={() => navigate(`/event/${event.id}/users`)}
                                                    >
                                                        Guest List
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant={rsvpedEvents.has(event.id) ? "danger" : "success"}
                                                        id={`rsvp-dropdown-${event.id}`}
                                                    >
                                                        {rsvpedEvents.has(event.id) ? "Leave Event" : "Join Event"}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        {!rsvpedEvents.has(event.id) ? (
                                                            <>
                                                                <Dropdown.Item onClick={() => handleRsvpToggle(event.id, "going")}>
                                                                    Going
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={() => handleRsvpToggle(event.id, "maybe")}>
                                                                    Might Go
                                                                </Dropdown.Item>
                                                                <Dropdown.Item>
                                                                    Not Going
                                                                </Dropdown.Item>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Dropdown.Item onClick={() => handleRsvpToggle(event.id)}>
                                                                    Cancel Event
                                                                </Dropdown.Item>
                                                            </>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                    )}

                    {/* Bootstrap Pagination */}
                    <Pagination className="mt-3 justify-content-center">
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item 
                                key={index} 
                                active={index + 1 === currentPage} 
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>            
            </Container>
        </>
    );
};

export default Dashboard;