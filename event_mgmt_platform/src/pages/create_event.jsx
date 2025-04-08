import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

/**
 * Component for creating a new event.
 * Allows admin users to create events, upload images, and mark events as premium-only.
 *
 * @component
 * @returns {JSX.Element} CreateEvent component
 */

const CreateEvent = () => {
  
  /**
   * State to store event data form inputs.
   * @type {Object}
   * @property {string} title - Event title
   * @property {string} description - Event description
   * @property {string} date - Event date
   * @property {string} location - Event location
   * @property {string} hosted_by - User ID of the host/admin
   * @property {boolean} premium_only - Flag for premium-only events
   */

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    hosted_by: "",
    premium_only: false, // Field for premium-only events
  });

    /**
   * State to store the uploaded image file.
   * @type {File|null}
   */

  const [eventImage, setEventImage] = useState(null); // State to hold the uploaded image file

  /**
   * State to store the role of the current user.
   * @type {string}
   */

  const [userRole, setUserRole] = useState(""); // To store user role
  const navigate = useNavigate();

  /**
   * Fetches the current admin user's details (ID and role) on component mount.
   * Sets the `hosted_by` field in event data.
   *
   * @async
   * @function fetchAdminUser
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/current-user/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.status === 200) {
          setEventData((prevData) => ({ ...prevData, hosted_by: response.data.id }));
          setUserRole(response.data.role); // Store the user role
        }
      } catch (error) {
        console.error("Error fetching admin user:", error);
      }
    };

    fetchAdminUser();
  }, []);

  /**
   * Handles input changes in the form fields.
   * Updates corresponding state variables.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
   */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "image") {
      setEventImage(e.target.files[0]); // Store the file separately
    } else if (type === "checkbox") {
      setEventData({ ...eventData, [name]: checked }); // Handle checkbox state
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  /**
   * Handles form submission to create a new event.
   * Sends event data and image (if any) to the backend.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {Promise<void>}
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the image along with event data
    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("location", eventData.location);
    formData.append("hosted_by", eventData.hosted_by);
    formData.append("premium_only", eventData.premium_only); // Include premium-only status

    if (eventImage) {
      formData.append("image", eventImage); // Append the image file if selected
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/event/create/`, formData, {
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

        {/* Premium Only Checkbox (Visible only for Admins) */}
        {userRole !== "premium_user" && userRole === "admin" && (
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Premium Only Event"
              name="premium_only"
              checked={eventData.premium_only}
              onChange={handleChange}
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="w-100">
          Create Event
        </Button>
      </Form>
    </Container>
  );
};

export default CreateEvent;