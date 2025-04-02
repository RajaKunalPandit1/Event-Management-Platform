import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const ManageEvent = () => {
    const { event_id } = useParams();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        date: "",
        image: "",  // Store image URL or file
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/event/${event_id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched Event Data:", response.data);
            const event = response.data.event;
            setEventData({
                title: event.title || "",
                location: event.location || "",
                description: event.description || "",
                date: event.date ? event.date.slice(0, 16) : "",  // Adjust for datetime-local format
                image: event.image || "",  // Load existing image
            });

            setLoading(false);
        } catch (error) {
            setError("Failed to load event details.");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, image: e.target.files[0] });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        const formData = new FormData();
        if (eventData.title) formData.append("title", eventData.title);
        if (eventData.location) formData.append("location", eventData.location);
        if (eventData.description) formData.append("description", eventData.description);
        if (eventData.date) formData.append("date", eventData.date);

        if (eventData.image && typeof eventData.image !== "string") {
            formData.append("image", eventData.image);
        }

        try {
            await axios.put(`http://127.0.0.1:8000/api/event/update/${event_id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage("Event updated successfully!");
            setError("");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            setError("Failed to update event.");
        }
    };

    const handleDeleteEvent = async () => {
        const token = localStorage.getItem("access_token");
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/event/delete/${event_id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Event deleted successfully!");
            navigate("/dashboard");
        } catch (error) {
            setError("Failed to delete event.");
        }
    };

    return (
        <Container className="mt-5 mb-4">
            <h2>Manage Event</h2>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    <Form onSubmit={handleUpdateEvent}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={eventData.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={eventData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={eventData.location}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="date"
                                value={eventData.date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Show existing image */}
                        {eventData.image && typeof eventData.image === "string" && (
                            <div className="mb-3">
                                <Form.Label>Current Event Image</Form.Label>
                                <br />
                                <img src={`http://127.0.0.1:8000${eventData.image}`} alt="Event" className="img-thumbnail" width="200" />
                            </div>
                        )}

                        {/* Upload new image */}
                        <Form.Group className="mb-3">
                            <Form.Label>Upload New Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleFileChange} accept="image/*" />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="me-2">
                            Update Event
                        </Button>
                        <Button variant="danger" onClick={handleDeleteEvent}>
                            Delete Event
                        </Button>
                    </Form>
                </>
            )}
        </Container>
    );
};

export default ManageEvent;