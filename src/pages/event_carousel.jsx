import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

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

const EventCarousel = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // sorting events in ascending order of date
                const sortedEvents = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));

                const updatedEvents = sortedEvents.slice(0, 5).map(event => ({
                    ...event,
                    image: event.image ? `http://127.0.0.1:8000${event.image}` : getRandomImage()
                }));

                setEvents(updatedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="w-100 position-relative" style={{ minHeight: "60vh", height: "60vh" }}>
            <Carousel controls={true} indicators={true} className="h-100">
                {events.map((event, index) => (
                    <Carousel.Item key={index} style={{ height: "60vh" }}>
                        <div
                            className="d-flex align-items-center justify-content-center text-white text-center"
                            style={{
                                backgroundImage: `url(${event.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                height: "60vh",
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