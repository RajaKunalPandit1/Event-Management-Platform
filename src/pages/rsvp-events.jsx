import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

const RSVPEvents = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRsvpedEvents();
    }, []);

    const fetchRsvpedEvents = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
    
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/my_rsvp_events/", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("RSVPed Events Response:", response.data); // Debugging
    
            // Merge all events from different RSVP statuses into a single list
            const allEvents = [
                ...response.data.going,
                ...response.data.not_going,
                ...response.data.maybe
            ];
    
            setEvents(allEvents);
        } catch (error) {
            console.error("Error fetching RSVPed events:", error);
            setEvents([]);
        }
    };    

    const handleRemoveRsvp = async (eventId) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;
    
        try {
            await axios.delete(`http://127.0.0.1:8000/api/event/${eventId}/remove-rsvp/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Remove event from state immediately after successful RSVP removal
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
        } catch (error) {
            console.error("Error removing RSVP:", error);
        }
    };    

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">My Joined Events</h2>
            {events.length === 0 ? (
                <p className="text-center text-muted">You have not joined any events yet.</p>
            ) : (
                <ListGroup>
                    {events.map((event) => (
                        <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{event.title}</h5>
                                <p className="text-muted">{new Date(event.date).toLocaleString()}</p>
                            </div>
                            <div>
                                <Button variant="info" className="me-2" onClick={() => navigate(`/event_details/${event.id}`)}>View</Button>
                                <Button variant="danger" onClick={() => handleRemoveRsvp(event.id)}>Leave Event</Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default RSVPEvents;