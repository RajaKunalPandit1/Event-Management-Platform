// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Form, Button, Spinner } from "react-bootstrap";

// const ManageEvent = () => {
//   const { eventId } = useParams();
//   const [eventData, setEventData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch event data from backend
//     fetch(`/api/events/${eventId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setEventData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching event:", err);
//         setLoading(false);
//       });
//   }, [eventId]);

//   const handleUpdate = () => {
//     fetch(`/api/event/update/${eventId}/`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Pass JWT token
//         },
//         body: JSON.stringify(eventData),
//     })
//     .then((res) => {
//         if (!res.ok) {
//             return res.json().then((err) => {
//                 throw new Error(err.error || "Failed to update event");
//             });
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log("Updated Event:", data);
//         alert("Event updated successfully!");
//     })
//     .catch((err) => console.error("Error updating event:", err));
// };


// const handleDelete = () => {
//     if (!window.confirm("Are you sure you want to delete this event?")) return;

//     fetch(`/api/event/delete/${eventId}/`, {
//         method: "DELETE",
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Pass JWT token
//         },
//     })
//     .then((res) => {
//         if (!res.ok) {
//             return res.json().then((err) => {
//                 throw new Error(err.error || "Failed to delete event");
//             });
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log("Deleted Event:", data);
//         alert("Event deleted successfully!");
//         navigate("/dashboard"); // Redirect after delete
//     })
//     .catch((err) => console.error("Error deleting event:", err));
// };

//   if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

//   if (!eventData) return <p className="text-center mt-5">Event not found.</p>;

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center">Manage Event</h2>
//       <Form className="shadow p-4 rounded bg-light">
//         <Form.Group className="mb-3">
//           <Form.Label>Title</Form.Label>
//           <Form.Control
//             type="text"
//             value={eventData.title}
//             onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Date</Form.Label>
//           <Form.Control
//             type="date"
//             value={eventData.date}
//             onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Location</Form.Label>
//           <Form.Control
//             type="text"
//             value={eventData.location}
//             onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
//           />
//         </Form.Group>
//         <Button variant="success" className="w-100 mb-2" onClick={handleUpdate}>Update Event</Button>
//         <Button variant="danger" className="w-100" onClick={handleDelete}>Delete Event</Button>
//       </Form>
//     </Container>
//   );
// };

// export default ManageEvent;


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
            setEventData(response.data);
            setLoading(false);
        } catch (error) {
            setError("Failed to load event details.");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        try {
            await axios.put(`http://127.0.0.1:8000/api/event/update/${event_id}/`, eventData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage("Event updated successfully!");
            setError("");
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
        <Container className="mt-5">
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
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={eventData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="date"
                                value={eventData.date}
                                onChange={handleInputChange}
                                required
                            />
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