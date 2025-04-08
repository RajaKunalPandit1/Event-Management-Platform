import { useState, useEffect } from "react";
import { Container, Card, Placeholder, Row, Col } from "react-bootstrap";
import EventCarousel from "./event_carousel";
import AdminDashboard from "./admin_dashboard";
import UserDashboard from "./user_dashboard";
import PremiumUserDashboard from "./premium_user_dashboard";

/**
 * Dashboard component that displays different dashboards based on the user's role.
 * 
 * - Admin users see the AdminDashboard.
 * - Premium users see the PremiumUserDashboard.
 * - Guest users see the UserDashboard.
 * 
 * While loading, it displays placeholder cards for better UX.
 * 
 * @component
 * @returns {JSX.Element} Rendered Dashboard component
 */

const Dashboard = () => {

    /**
     * @state {string} role - Stores the role of the current user.
     */

    const [role, setRole] = useState("");

    /**
     * @state {boolean} loading - Determines whether the dashboard is in a loading state.
     */
    const [loading, setLoading] = useState(true);
    
    /**
     * useEffect hook to fetch the role from localStorage on component mount.
     * Adds a small delay to simulate loading state.
     */

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) setRole(storedRole);

        setTimeout(() => {
            setLoading(false);
        }, 500); // Smooth loading
    }, []);

    /**
     * Renders a placeholder card while the actual dashboard is loading.
     * 
     * @function
     * @returns {JSX.Element} Placeholder Card component
     */

    const renderPlaceholderCard = () => (
        <Col md={4} className="mb-4">
            <Card aria-hidden="true">
                <Card.Body>
                    <Card.Title className="placeholder-glow">
                        <span className="placeholder col-6"></span>
                    </Card.Title>
                    <Card.Text className="placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-8"></span>
                    </Card.Text>
                    <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <>
            {/* Carousel showing event images */}
            <EventCarousel />
            <Container className="mt-4">
                {loading ? (
                    <Row>
                        {renderPlaceholderCard()}
                        {renderPlaceholderCard()}
                        {renderPlaceholderCard()}
                    </Row>
                ) : (
                    <>
                        {/* Render dashboards based on user role */}
                        {role === "admin" && <AdminDashboard />}
                        {role === "premium_user" && <PremiumUserDashboard />}
                        {role === "guest" && <UserDashboard />}
                    </>
                )}
            </Container>
        </>
    );
};

export default Dashboard;