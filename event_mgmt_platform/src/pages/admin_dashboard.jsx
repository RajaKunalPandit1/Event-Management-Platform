import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form, Row, Col, InputGroup, Pagination, Card, Toast } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../config";

/**
 * AdminDashboard component displays and manages admin-specific functionalities
 * such as viewing, filtering, and making events public.
 *
 * @component
 * @returns {JSX.Element} Rendered Admin Dashboard component
 */

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [dateFilter, setDateFilter] = useState("");
    const [username, setUsername] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showToast, setShowToast] = useState(true);

    const eventsPerPage = 6;
    const navigate = useNavigate();

    /**
     * Fetches the admin events whenever filters or page number change.
     */

    useEffect(() => {
        fetchAdminEvents(currentPage);
    }, [dateFilter, locationFilter, currentPage]);

    /**
     * Retrieves the stored username from localStorage on initial load.
     */

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, []);

    /**
     * Fetches events from the API for the admin user.
     *
     * @async
     * @param {number} page - The current page number to fetch.
     * @returns {Promise<void>}
     */

    const fetchAdminEvents = async (page) => {
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
            console.error("Error fetching admin events:", error);
        }
    };

    /**
     * Marks a specific event as public.
     *
     * @async
     * @param {number} eventId - The ID of the event to make public.
     * @returns {Promise<void>}
     */

    const makeEventPublic = async (eventId) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            await axios.patch(`${BASE_URL}/api/event/${eventId}/make-public/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAdminEvents(currentPage);
        } catch (error) {
            console.error("Error making event public:", error);
        }
    };

    /**
     * Updates the current page number for pagination.
     *
     * @param {number} pageNumber - The selected page number.
     */

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Container className="mt-3">
            <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} autohide delay={3000} className="bg-success text-white shadow">
                    <Toast.Header closeButton={false} className="bg-success text-white">
                        <strong className="me-auto">Welcome {username}! Enjoy the events.</strong>
                        <Button variant="outline-light" size="sm" onClick={() => setShowToast(false)}>✖</Button>
                    </Toast.Header>
                </Toast>
            </div>
            {/* Filters and Add Event Button */}
            <div className="d-flex justify-content-center mb-4">
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

                {/* Add Event Button */}
                
                <Button
                    variant="primary"
                    className="ms-3 px-4 rounded-pill shadow-sm"
                    style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "none";
                    }}
                    onClick={() => navigate("/add_event")}
                >
                    Add Event
                </Button>
            </div>

            {/* Event List */}
            <h3>Your Events:</h3>
            {events.length === 0 ? (
                <p className="text-center text-muted">No events found.</p>
            ) : (
                <Row className="justify-content-center">
                    {events.map((event) => (
                        <Col key={event.id} md={4} className="mb-4">
                            <Card className="shadow">
                                <Card.Img
                                    variant="top"
                                    src={event.image ? `${BASE_URL}${event.image}` : "https://images.unsplash.com/photo-1535041195258-607127544040?q=80&w=2070&auto=format&fit=crop"}
                                    alt={event.title}
                                    style={{ height: "250px", objectFit: "cover" }}
                                    
                                />
                                <Card.Body>
                                    {/* <Card.Title>{event.title}</Card.Title> */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Card.Title className="mb-0">{event.title}</Card.Title>
                                        {event.premium_only && (
                                            <Button variant="link" className="p-0 ms-2" onClick={() => makeEventPublic(event.id)}>
                                                Make Event Public
                                            </Button>
                                        )}
                                    </div>
                                    <Card.Text>
                                        <strong>Description:</strong> {event.description} <br />
                                        <strong>Date:</strong> {event.date.split("T")[0]} <br />
                                        <strong>Location:</strong> {event.location} <br />
                                    </Card.Text>
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
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Pagination */}

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

export default AdminDashboard;