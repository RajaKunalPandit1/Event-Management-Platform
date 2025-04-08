import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Container, Table, Button } from "react-bootstrap";
import BASE_URL from "../config";

/**
 * EventUsers component displays the list of users who RSVPed for a specific event.
 * 
 * Features:
 * - Fetches RSVPed users (Going, Maybe, Not Going) from the backend.
 * - Displays users in a table with their status.
 * - Allows removing a user from the RSVP list.
 * 
 * @component
 * @returns {JSX.Element} Rendered EventUsers component.
 */

const EventUsers = () => {

    /** 
     * Get event ID from URL parameters.
     * @type {{ event_id: string }}
     */
    const { event_id } = useParams();

    /**
     * State to hold the list of RSVP users.
     * @type {Array<Object>}
     */
    const [users, setUsers] = useState([]);
    
    /**
     * State to manage loading state of the component.
     * @type {boolean}
     */
    const [loading, setLoading] = useState(true);


    /**
     * Fetch the list of users who RSVPed for the event.
     * Uses token from local storage for authorization.
     * Flattens the response into a single list with RSVP status.
     */
    useEffect(() => {
        const fetchRSVPUsers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`${BASE_URL}/api/event/${event_id}/rsvp-users/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // Flatten response data into a single array
                const formattedUsers = [
                    ...response.data.going.map(user => ({ ...user, status: "Going" })),
                    ...response.data.maybe.map(user => ({ ...user, status: "Maybe" })),
                    ...response.data.not_going.map(user => ({ ...user, status: "Not Going" }))
                ];
                setUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching RSVP users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRSVPUsers();
    }, [event_id]);

    /**
     * Handle removal of a user's RSVP from the event.
     * Makes a DELETE request to the backend and updates the local state.
     * 
     * @param {number} userId - ID of the user to remove from RSVP.
     */
    const handleRemoveRSVP = async (userId) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${BASE_URL}/api/event/${event_id}/remove-user-rsvp/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.user__id !== userId));
        } catch (error) {
            console.error("Error removing RSVP:", error);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading RSVPed users...</div>;

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Event Guest List</h2>
            <Card className="shadow-lg p-3">
                <Card.Body>
                    {users.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user__id}>
                                        <td>{user.user__username}</td>
                                        <td>{user.user__email || "N/A"}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveRSVP(user.user__id)}>
                                                Remove RSVP
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-center">No users to show here</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EventUsers;