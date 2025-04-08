import { useEffect, useState } from "react";
import { Carousel, Placeholder } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config";

/**
 * Returns a random image URL from a predefined list.
 * Used as a fallback if an event does not have an image.
 *
 * @returns {string} Random image URL
 */

const getRandomImage = () => {
    const randomImages = [
        "https://images.unsplash.com/photo-1619973226698-b77a5b5dd14b?q=80&w=2071&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577733641835-998f7e303679?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=1931&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
    ];
    return randomImages[Math.floor(Math.random() * randomImages.length)];
};

/**
 * EventCarousel component displays a carousel of upcoming events.
 * - Fetches events from API.
 * - Shows a placeholder while loading.
 * - Limits to top 5 upcoming events.
 *
 * @component
 * @returns {JSX.Element} The rendered EventCarousel component.
 */

const EventCarousel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * Fetches events from the backend API, sorts them by date,
         * and sets the events state with up to 5 upcoming events.
         */
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`${BASE_URL}/api/events/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const eventList = response.data.results || response.data;

                const sortedEvents = eventList.sort((a, b) => new Date(a.date) - new Date(b.date));

                const updatedEvents = sortedEvents.slice(0, 5).map(event => ({
                    ...event,
                    image: event.image ? `${BASE_URL}${event.image}` : getRandomImage()
                }));

                setEvents(updatedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    /**
     * Renders a placeholder carousel item for loading state.
     *
     * @param {number} key - Unique key for the placeholder item
     * @returns {JSX.Element} Placeholder carousel item
     */

    const renderPlaceholderItem = (key) => (
        <Carousel.Item key={key} style={{ height: "60vh" }}>
            <div
                className="d-flex align-items-center justify-content-center text-white text-center"
                style={{
                    backgroundColor: "#e0e0e0",
                    height: "60vh",
                    width: "100%",
                }}
            >
                <div className="bg-dark bg-opacity-50 p-3 rounded text-white w-75">
                    <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={4} /> | <Placeholder xs={3} />
                    </Placeholder>
                </div>
            </div>
        </Carousel.Item>
    );

    return (
        <div className="w-100 position-relative" style={{ minHeight: "80vh", height: "80vh" }}>
            <Carousel controls indicators className="h-100">
                {loading
                    ? [1, 2, 3].map((_, index) => renderPlaceholderItem(index))
                    : events.map((event, index) => (
                        <Carousel.Item key={index} style={{ height: "80vh" }}>
                            <div
                                className="d-flex align-items-center justify-content-center text-white text-center"
                                style={{
                                    backgroundImage: `url(${event.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "80vh",
                                    width: "100%",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open(`/event_details/${event.id}`, "_blank")}
                            >
                                <div className="bg-dark bg-opacity-50 p-3 rounded text-white">
                                    <h2>{event.title}</h2>
                                    <p>{event.date.split("T")[0]} | {event.location}</p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
            </Carousel>
        </div>
    );
};

export default EventCarousel;