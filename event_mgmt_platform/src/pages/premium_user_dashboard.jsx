import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Form, InputGroup, Row, Col, Dropdown, Pagination, Toast } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../config";

/**
 * PremiumUserDashboard Component
 * 
 * This component renders the dashboard for premium users.
 * Users can:
 * - View paginated event listings.
 * - Filter events by date and location.
 * - RSVP to events (going, maybe, or not going).
 * - Remove RSVPs.
 * - View their previously RSVPed events.
 * 
 * @component
 */

const PremiumUserDashboard = () => {

    // State variables
    const [events, setEvents] = useState([]); // List of events to display
    const [rsvpedEvents, setRsvpedEvents] = useState(new Set()); // Set of RSVPed event IDs
    const [dateFilter, setDateFilter] = useState(""); // Filter for event date
    const [username, setUsername] = useState(""); // Logged-in user's username
    const [showToast, setShowToast] = useState(true); // Toast message visibility
    const [locationFilter, setLocationFilter] = useState(""); // Filter for event location
    const [currentPage, setCurrentPage] = useState(1); // Current pagination page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    
    const eventsPerPage = 6;
    const navigate = useNavigate();
    
    /**
     * useEffect - Fetch events whenever filters or current page changes
    */
    useEffect(() => {
        fetchEvents(currentPage);
    }, [dateFilter, locationFilter, currentPage]);
    
    /**
     * useEffect - Initialize user and fetch RSVPed events on component mount
     */
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
        fetchRsvpedEvents(); // Load RSVPed events

    },[]);

    /**
     * Fetches events that the user has RSVPed to and updates state.
     * @async
     */
    const fetchRsvpedEvents = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
    
        try {
            const response = await axios.get(`${BASE_URL}/api/my_rsvp_events/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("RSVP Response Data:", response.data); // Debugging step
    
            // Flatten the RSVP categories into a single array
            const allEvents = [
                ...response.data.going,
                ...response.data.not_going,
                ...response.data.maybe,
            ];
    
            const rsvpEventIds = new Set(allEvents.map(event => event.id));
            setRsvpedEvents(rsvpEventIds);
        } catch (error) {
            console.error("Error fetching RSVPed events:", error);
        }
    };
    
    /**
     * Fetches events from the API with applied filters and pagination.
     * @async
     * @param {number} page - Current page number for pagination.
     */
    const fetchEvents = async (page) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const response = await axios.get(`${BASE_URL}/api/events/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { date: dateFilter, location: locationFilter, page: page, page_size: eventsPerPage },
            });
            setEvents(response.data.results);
            setTotalPages(Math.ceil(response.data.count / eventsPerPage));
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    /**
     * Handles RSVP toggle (add or remove RSVP).
     * @async
     * @param {number} eventId - ID of the event to RSVP to or remove RSVP from.
     * @param {string} [status="maybe"] - RSVP status ('going', 'maybe', 'not_going').
     */
    const handleRsvpToggle = async (eventId, status = "maybe") => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
    
        const isRsvped = rsvpedEvents.has(eventId);
    
        try {
            if (isRsvped) {
                await axios.delete(`${BASE_URL}/api/event/${eventId}/remove-rsvp/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRsvpedEvents(prev => {
                    const updatedRsvps = new Set(prev);
                    updatedRsvps.delete(eventId);
                    return updatedRsvps;
                });
            } else {
                await axios.post(`${BASE_URL}/api/event/${eventId}/rsvp/`, { status }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRsvpedEvents(prev => {
                    const updatedRsvps = new Set(prev);
                    updatedRsvps.add(eventId);
                    return updatedRsvps;
                });
            }
        } catch (error) {
            console.error(`Error ${isRsvped ? "removing RSVP" : "RSVPing"}:`, error);
        }
    };

    /**
     * Handles pagination page change.
     * @param {number} pageNumber - The new page number to navigate to.
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
                     <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-success text-white shadow">
                         <Toast.Header closeButton={false} className="bg-success text-white">
                             <strong className="me-auto">Welcome {username}! Enjoy the events.</strong>
                             <Button variant="outline-light" size="sm" onClick={() => setShowToast(false)}>✖</Button>
                         </Toast.Header>
                     </Toast>
                 </div>
            <Container className="mt-3">
                
            <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
                <InputGroup className="shadow-sm rounded-3" style={{ width: "auto", maxWidth: "600px" }}>
                    <InputGroup.Text className="bg-white border-end-0">
                        <FaMapMarkerAlt className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="City or Location"
                        className="border-start-0 border-end-0 shadow-none"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        style={{ transition: "box-shadow 0.3s" }}
                        onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 123, 255, 0.5)"}
                        onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                    <InputGroup.Text className="bg-white border-end-0 border-start-0">
                        <FaCalendarAlt className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                        type="date"
                        className="border-start-0 shadow-none"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ transition: "box-shadow 0.3s" }}
                        onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 123, 255, 0.5)"}
                        onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                </InputGroup>

                <Button
                    variant="info"
                    className="ms-3 px-4 rounded-pill shadow-sm text-white"
                    style={{
                        transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
                        backgroundColor: "#17a2b8",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 4px 12px rgba(23, 162, 184, 0.3)";
                        e.target.style.backgroundColor = "#138496";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "#17a2b8";
                    }}
                    onClick={() => navigate("/rsvped_events")}
                >
                    Joined Events
                </Button>
            </div>

                <h3 className="mt-4">All Events:</h3>
                {events.length === 0 ? (
                    <p className="text-center text-muted">No events found.</p>
                ) : (
                    <Row>
                        {events.map((event) => (
                            <Col key={event.id} md={4} className="mb-4">
                                <Card className="shadow">
                                    <Card.Img
                                        variant="top"
                                        // src={event.image ? `${BASE_URL}${event.image}` : "https://images.unsplash.com/photo-1535041195258-607127544040?q=80&w=2070&auto=format&fit=crop"}
                                        src={event.image ? `${event.image}` : "https://images.unsplash.com/photo-1535041195258-607127544040?q=80&w=2070&auto=format&fit=crop"}
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
                                                    <Dropdown.Item onClick={() => handleRsvpToggle(event.id)}>
                                                        Cancel Event
                                                    </Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Card.Body>
                                </Card>
                                {event.premium_only && (
                                    <div className="text-center p-2 bg-warning text-dark rounded">
                                        <strong>You've early access to this event!</strong>
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>
                )}
            {totalPages > 1 && (
                <Pagination className="justify-content-center mt-4">
                    {[...Array(totalPages).keys()].map((number) => (
                        <Pagination.Item
                            key={number + 1}
                            active={number + 1 === currentPage}
                            onClick={() => handlePageChange(number + 1)}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}
            </Container>
        </>
    );
};

export default PremiumUserDashboard;