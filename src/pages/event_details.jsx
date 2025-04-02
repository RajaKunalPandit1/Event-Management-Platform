import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth_context";
import { Dropdown, Button } from "react-bootstrap";

const EventDetails = () => {
    const { event_id } = useParams();
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRSVPed, setIsRSVPed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8000/api/event/${event_id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Fetched Event Data:", response.data);

                setEvent(response.data.event);
                setIsAdmin(response.data.is_admin);
                setIsRSVPed(response.data.is_rsvped);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, [event_id]);

    const handleRSVP = async (status) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(`http://127.0.0.1:8000/api/event/${event_id}/rsvp/`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsRSVPed(true);
        } catch (error) {
            console.error("Failed to RSVP:", error);
        }
    };
    
    const handleCancelRSVP = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://127.0.0.1:8000/api/event/${event_id}/remove-rsvp/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsRSVPed(false);
        } catch (error) {
            console.error("Failed to cancel RSVP:", error);
        }
    };
    

    const handleDelete = async () => {
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

    if (!event) return <div className="text-center mt-5">Loading event details...</div>;

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow-lg p-4">
                {/* Event Title */}
                <h2 className="mb-4 text-center text-primary">{event.title}</h2>

                {/* Image Handling */}
                <div className="text-center">
                    <img
                        src={event.image ? `http://127.0.0.1:8000${event.image}` : "https://dummyimage.com/800x400/ccc/fff"}
                        alt={event.title}
                        className="img-fluid rounded border shadow"
                        style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
                    />
                </div>

                {/* Event Details */}
                <div className="mt-4">
                    <p className="lead"><strong>Description:</strong> {event.description || "No description available."}</p>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Date:</strong> {event.date.split('T')[0] || "N/A"}</p>
                        </div>
                    </div>
                    
                    <p><strong>Location:</strong> <span className="badge bg-secondary">{event.location || "N/A"}</span></p>
                </div>

                {/* Buttons */}
                <div className="mt-4 text-center">
                    {isAdmin ? (
                        <>
                            <Button variant="warning" className="mx-2 px-4" onClick={() => navigate(`/manage_event/${event.id}`)}>
                                Edit
                            </Button>
                            <Button variant="danger" className="px-4" onClick={handleDelete}>
                                Delete
                            </Button>
                        </>
                    ) : (
                        <Dropdown>
                            <Dropdown.Toggle variant={isRSVPed ? "danger" : "success"} id="rsvp-dropdown">
                                {isRSVPed ? "Leave Event" : "Join Event"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {!isRSVPed ? (
                                    <>
                                        <Dropdown.Item onClick={() => handleRSVP("going")}>
                                            Going
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleRSVP("maybe")}>
                                            Might Go
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleRSVP("not_going")}>
                                            Not Going
                                        </Dropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <Dropdown.Item onClick={handleCancelRSVP}>
                                            Cancel Event
                                        </Dropdown.Item>
                                    </>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;