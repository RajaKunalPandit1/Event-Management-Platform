import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Form, Row, Col, InputGroup, Pagination, Dropdown, Toast } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../config";

/**
 * UserDashboard component for displaying and managing user-specific events.
 * 
 * Features:
 * - Fetches and displays events with pagination.
 * - Filters events by date and location.
 * - Manages RSVP status (Going, Not Going, Maybe).
 * - Shows username from localStorage.
 * 
 * @component
 */

const UserDashboard = () => {
    const [events, setEvents] = useState([]);
    const [username, setUsername] = useState("");
    const [showToast, setShowToast] = useState(true);
    const [rsvpedEvents, setRsvpedEvents] = useState(new Set());
    const [dateFilter, setDateFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const eventsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents(currentPage);
    }, [dateFilter, locationFilter, currentPage]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);

        fetchRsvpedEvents(); // Fetch RSVPed events on mount
    }, []);

    /**
     * Fetches the list of events from the API with optional filters and pagination.
     *
     * @async
     * @function fetchEvents
     * @param {number} page - The page number to fetch.
     * @returns {Promise<void>}
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
     * Fetches the events that the user has RSVPed to and stores their IDs.
     *
     * @async
     * @function fetchRsvpedEvents
     * @returns {Promise<void>}
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
     * Handles RSVP toggle for an event. If the event is already RSVPed, it removes the RSVP;
     * otherwise, it RSVPs to the event with the given status.
     *
     * @async
     * @function handleRsvpToggle
     * @param {number} eventId - The ID of the event.
     * @param {string} [status="maybe"] - The RSVP status ('going', 'not_going', or 'maybe').
     * @returns {Promise<void>}
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

                setRsvpedEvents((prev) => {
                    const updatedRsvps = new Set(prev);
                    updatedRsvps.delete(eventId);
                    return updatedRsvps;
                });
            } else {
                await axios.post(`${BASE_URL}/api/event/${eventId}/rsvp/`, { status }, {
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

    /**
     * Handles pagination page changes by updating the current page state.
     *
     * @function handlePageChange
     * @param {number} pageNumber - The page number to switch to.
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Container className="mt-3 mb-5">
            <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-success text-white shadow">
                    <Toast.Header closeButton={false} className="bg-success text-white">
                        <strong className="me-auto">Welcome {username}! Enjoy the events.</strong>
                        <Button variant="outline-light" size="sm" onClick={() => setShowToast(false)}>✖</Button>
                    </Toast.Header>
                </Toast>
            </div>

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

            <h3 className="mt-4">Available Events:</h3>
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
                                        <Dropdown.Toggle variant={rsvpedEvents.has(event.id) ? "danger" : "success"}>
                                            {rsvpedEvents.has(event.id) ? "Leave Event" : "Join Event"}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {!rsvpedEvents.has(event.id) ? (
                                                <>
                                                    <Dropdown.Item onClick={() => handleRsvpToggle(event.id, "going")}>Going</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleRsvpToggle(event.id, "maybe")}>Might Go</Dropdown.Item>
                                                    <Dropdown.Item>Not Going</Dropdown.Item>
                                                </>
                                            ) : (
                                                <Dropdown.Item onClick={() => handleRsvpToggle(event.id)}>Cancel Event</Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Card.Body>
                            </Card>
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
    );
};

export default UserDashboard;