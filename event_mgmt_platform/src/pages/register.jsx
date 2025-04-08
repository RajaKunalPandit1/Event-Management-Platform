import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { Icon } from '@iconify/react';
import eye from '@iconify-icons/mdi/eye';
import eyeOff from '@iconify-icons/mdi/eye-off';
import { useNavigate } from "react-router-dom";

/** This page registers a new user and displays error msgs in case of an error */

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(""); // To store error messages

    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggle = () => {
        if (type==='password'){
           setIcon(eye);
           setType('text')
        } else {
           setIcon(eyeOff)
           setType('password')
        }
     }
    
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message before making request

        const { password } = formData;

        // Password validation checks
        if (password.length < 5) {
            setErrorMessage("Password must be at least 5 characters long.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setErrorMessage("Password must contain at least one special character.");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/register/`, formData, { /**Sending data for registering */
                headers: { "Content-Type": "application/json" }
            });
            // alert(response.data.message); // Show success message
            navigate("/login"); // Redirect to login page after successful registration

        } catch (error) {
            if (error.response && error.response.data) {
                // If backend returns "email already in use", display the message
                if (error.response.data.error === "Email already in use") {
                    setErrorMessage("Email already in use.");
                } else {
                    setErrorMessage(error.response.data.error || "Registration Failed!");
                }
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2 col-xl-7 offset-xl-2">

                    <div className="card shadow">
                        <img
                            src="https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVnaXN0cmF0aW9ufGVufDB8fDB8fHww"
                            alt="Login Banner"
                            className="card-img-top"
                        />
                        <div className="card-body">
                            <h5 className="card-title text-center">Register</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        />
                                </div>

                                <div className="mb-3 position-relative">
                                    <label className="form-label">Password</label>
                                    <input
                                        className="form-control pe-5" // Adds padding to the right to prevent text overlap
                                        type={type}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        />
                                    <span 
                                        className="position-absolute"
                                        style={{ 
                                            right: '15px', 
                                            top: '70%', 
                                            transform: 'translateY(-50%)', 
                                            cursor: 'pointer' 
                                        }} 
                                        onClick={handleToggle}>
                                        <Icon icon={icon} size={20} />
                                    </span>
                                </div>

                                {errorMessage && (
                                    <div 
                                        className="position-fixed top-0 start-50 translate-middle-x mt-3 p-3 bg-danger text-white rounded shadow-lg"
                                        style={{ zIndex: 1050, minWidth: "300px" }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>{errorMessage}</span>
                                            <button 
                                                type="button" 
                                                className="btn-close btn-close-white" 
                                                aria-label="Close"
                                                onClick={() => setErrorMessage("")} // Close pop-up on click
                                            ></button>
                                        </div>
                                    </div>
                                )}
                                <button className="btn btn-success w-100" type="submit">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;