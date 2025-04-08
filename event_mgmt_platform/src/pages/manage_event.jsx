import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config";

/**
 * Component for managing an individual event.
 * Allows admins to view, update, and delete event details.
 * 
 * @component
 */

const ManageEvent = () => {
    const { event_id } = useParams();
    const navigate = useNavigate();

    /**
     * State to store the event details.
     * @type {Object}
     * @property {string} title - Event title.
     * @property {string} description - Event description.
     * @property {string} date - Event date (YYYY-MM-DDTHH:mm).
     * @property {string} location - Event location.
     * @property {string|File} image - Event image URL or file object.
     * @property {boolean} premium_only - Whether the event is for premium users only.
     */
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        image: "",
        premium_only: false, 
    });

    /** @type {[boolean, Function]} Loading state */
    const [loading, setLoading] = useState(true);

    /** @type {[string, Function]} Error message state */
    const [error, setError] = useState("");

    /** @type {[string, Function]} Success message state */
    const [successMessage, setSuccessMessage] = useState("");

    /** @type {[boolean, Function]} State to show or hide delete confirmation modal */
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /** @type {[boolean, Function]} State to show or hide success modal */
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, []);

    /**
     * Fetches event details from the backend API and updates the state.
     * Handles errors and sets the loading state.
     * @async
     * @function
     */

    const fetchEventDetails = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.get(`${BASE_URL}/api/event/${event_id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const event = response.data.event;
            setEventData({
                title: event.title || "",
                location: event.location || "",
                description: event.description || "",
                date: event.date ? event.date.slice(0, 16) : "",
                image: event.image || "",
                premium_only: event.premium_only || false, 
            });

            setLoading(false);
        } catch (error) {
            setError("Failed to load event details.");
            setLoading(false);
        }
    };

    /**
     * Handles input changes for text fields and updates event data state.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The input change event.
     */
    const handleInputChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    /**
     * Handles checkbox changes and updates the premium_only state.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The checkbox change event.
     */
    const handleCheckboxChange = (e) => {
        setEventData({ ...eventData, premium_only: e.target.checked });
    };

    /**
     * Handles file input changes and updates the image state.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
     */
    const handleFileChange = (e) => {
        setEventData({ ...eventData, image: e.target.files[0] });
    };

    /**
     * Handles the form submission to update the event details.
     * Submits the form data to the backend API.
     * @async
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        const formData = new FormData();
        formData.append("title", eventData.title);
        formData.append("location", eventData.location);
        formData.append("description", eventData.description);
        formData.append("date", eventData.date);
        formData.append("premium_only", eventData.premium_only);

        if (eventData.image && typeof eventData.image !== "string") {
            formData.append("image", eventData.image);
        }

        try {
            await axios.put(`${BASE_URL}/api/event/update/${event_id}/`, formData, {
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

    /**
     * Handles the deletion of the event.
     * Sends a delete request to the backend API.
     * @async
     * @function
     */
    const handleDeleteEvent = async () => {
        const token = localStorage.getItem("access_token");
        try {
            await axios.delete(`${BASE_URL}/api/event/delete/${event_id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowDeleteModal(false);
            setShowSuccessModal(true); 
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

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Make this event premium"
                                name="premium_only"
                                checked={eventData.premium_only}
                                onChange={handleCheckboxChange}
                            />
                        </Form.Group>

                        {eventData.image && typeof eventData.image === "string" && (
                            <div className="mb-3">
                                <Form.Label>Current Event Image</Form.Label>
                                <br />
                                <img src={`${BASE_URL}${eventData.image}`} alt="Event" className="img-thumbnail" width="200" />
                            </div>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Upload New Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleFileChange} accept="image/*" />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="me-2">
                            Update Event
                        </Button>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                            Delete Event
                        </Button>
                    </Form>
                </>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this event? This action cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteEvent}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Modal after Deletion */}
            <Modal show={showSuccessModal} onHide={() => navigate("/dashboard")} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Event Deleted</Modal.Title>
                </Modal.Header>
                <Modal.Body>The event has been successfully deleted.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => navigate("/dashboard")}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ManageEvent;