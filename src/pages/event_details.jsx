import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth_context";

const EventDetails = () => {
    const { id } = useParams(); // Get event ID from URL
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRSVPed, setIsRSVPed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8000/api/event/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setEvent(response.data);
                setIsAdmin(response.data.is_admin);
                setIsRSVPed(response.data.is_rsvped);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleRSVP = async () => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(`http://127.0.0.1:8000/api/event/${id}/rsvp/`, {}, {
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
            await axios.post(`http://127.0.0.1:8000/api/event/${id}/remove-rsvp/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsRSVPed(false);
        } catch (error) {
            console.error("Failed to cancel RSVP:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://127.0.0.1:8000/api/event/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    if (!event) return <div className="text-center mt-5">Loading event details...</div>;

    return (
        <div className="container mt-5">
            <h2>{event.title}</h2>
            <img
                src={event.image || "https://via.placeholder.com/800x400"}
                alt={event.title}
                className="img-fluid mb-3"
                style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Description:</strong> {event.description}</p>

            {isAdmin ? (
                <>
                    <button className="btn btn-warning mx-2" onClick={() => navigate(`/edit_event/${id}`)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Delete
                    </button>
                </>
            ) : (
                isRSVPed ? (
                    <button className="btn btn-danger" onClick={handleCancelRSVP}>
                        Cancel RSVP
                    </button>
                ) : (
                    <button className="btn btn-success" onClick={handleRSVP}>
                        RSVP Now
                    </button>
                )
            )}
        </div>
    );
};

export default EventDetails;