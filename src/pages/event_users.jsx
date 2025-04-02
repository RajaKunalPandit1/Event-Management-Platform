import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Container, Table, Button } from "react-bootstrap";

const EventUsers = () => {
    const { event_id } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRSVPUsers = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8000/api/event/${event_id}/rsvp-users/`, {
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

    const handleRemoveRSVP = async (userId) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://127.0.0.1:8000/api/event/${event_id}/remove-user-rsvp/${userId}/`, {
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