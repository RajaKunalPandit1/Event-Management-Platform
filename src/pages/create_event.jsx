import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    hosted_by: "",
  });

  const [eventImage, setEventImage] = useState(null); // State to hold the uploaded image file
  const navigate = useNavigate();

  // Fetch the current admin user ID
  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/current-user/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.status === 200) {
          setEventData((prevData) => ({ ...prevData, hosted_by: response.data.id }));
        }
      } catch (error) {
        console.error("Error fetching admin user:", error);
      }
    };

    fetchAdminUser();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setEventImage(e.target.files[0]); // Store the file separately
    } else {
      setEventData({ ...eventData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the image along with event data
    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("location", eventData.location);
    formData.append("hosted_by", eventData.hosted_by);
    if (eventImage) {
      formData.append("image", eventImage); // Append the image file if selected
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/event/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.status === 201) {
        console.log("Event Created Successfully:", response.data);
        navigate("/dashboard");
      }
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
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" placeholder="Enter event description" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" placeholder="Enter event location" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Event Image</Form.Label>
          <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">Create Event</Button>
      </Form>
    </Container>
  );
};

export default CreateEvent;