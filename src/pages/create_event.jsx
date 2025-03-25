// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const EventForm = () => {
//     const { eventId } = useParams() || {};
//     const navigate = useNavigate();

//     const [event, setEvent] = useState({
//         title: "",
//         description: "",
//         date: "",
//         location: ""
//     });

//     const [isUpdating, setIsUpdating] = useState(false);

//     // useEffect(() => {
//     //     if (eventId) {
//     //         setIsUpdating(true);
//     //         axios.get(`/api/event/update/${eventId}/`) // Fetch existing event details
//     //             .then(response => {
//     //                 setEvent(response.data);
//     //             })
//     //             .catch(error => console.error("Error fetching event:", error));
//     //     }
//     // }, [eventId]);

//     useEffect(() => {
//         if (eventId && eventId !== "create") { // Avoid fetching when creating
//             setIsUpdating(true);
//             axios.get(`/api/event/update/${eventId}/`)
//                 .then(response => {
//                     setEvent(response.data);
//                 })
//                 .catch(error => console.error("Error fetching event:", error));
//         }
//     }, [eventId]);    

//     const handleChange = (e) => {
//         setEvent({ ...event, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (isUpdating) {
//                 await axios.put(`/api/event/update/${eventId}/`, event); // Update API
//                 alert("Event updated successfully!");
//             } else {
//                 await axios.post("/api/event/create/", event); // Create API
//                 alert("Event created successfully!");
//             }
//             navigate("/dashboard"); // Redirect back to dashboard
//         } catch (error) {
//             console.error("Error submitting event:", error);
//         }
//     };

//     const handleDelete = async () => {
//         if (window.confirm("Are you sure you want to delete this event?")) {
//             try {
//                 await axios.delete(`/api/event/delete/${eventId}/`); // Delete API
//                 alert("Event deleted successfully!");
//                 navigate("/dashboard");
//             } catch (error) {
//                 console.error("Error deleting event:", error);
//             }
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center">{isUpdating ? "Update Event" : "Create Event"}</h2>
//             <form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded">
//                 <div className="mb-3">
//                     <label className="form-label">Event Title</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="title"
//                         value={event.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea
//                         className="form-control"
//                         name="description"
//                         value={event.description}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Date & Time</label>
//                     <input
//                         type="datetime-local"
//                         className="form-control"
//                         name="date"
//                         value={event.date}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="location"
//                         value={event.location}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>

//                 <button type="submit" className="btn btn-success">
//                     {isUpdating ? "Update Event" : "Create Event"}
//                 </button>

//                 {isUpdating && (
//                     <button type="button" className="btn btn-danger ms-2" onClick={handleDelete}>
//                         Delete Event
//                     </button>
//                 )}
//             </form>

//             <button className="btn btn-secondary mt-3" onClick={() => navigate("/dashboard")}>
//                 Back to Dashboard
//             </button>
//         </div>
//     );
// };

// export default EventForm;

// import React, { useState } from "react";
// import { Container, Form, Button } from "react-bootstrap";

// const CreateEvent = () => {
//   const [eventData, setEventData] = useState({
//     title: "",
//     date: "",
//     location: "",
//   });

//   const handleChange = (e) => {
//     setEventData({ ...eventData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Event Created:", eventData);
//     // Send eventData to backend
//   };

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center">Create Event</h2>
//       <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
//         <Form.Group className="mb-3">
//           <Form.Label>Title</Form.Label>
//           <Form.Control type="text" name="title" placeholder="Enter event title" onChange={handleChange} required />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Date</Form.Label>
//           <Form.Control type="date" name="date" onChange={handleChange} required />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Location</Form.Label>
//           <Form.Control type="text" name="location" placeholder="Enter event location" onChange={handleChange} required />
//         </Form.Group>
//         <Button variant="primary" type="submit" className="w-100">Create Event</Button>
//       </Form>
//     </Container>
//   );
// };

// export default CreateEvent;
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
  });

  const navigate = useNavigate(); // For redirection

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/event/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Ensure token is included
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      console.log("Event Created Successfully:", data);

      // Redirect to dashboard after successful event creation
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Create Event</h2>
      <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" placeholder="Enter event title" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" placeholder="Enter event location" onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">Create Event</Button>
      </Form>
    </Container>
  );
};

export default CreateEvent;