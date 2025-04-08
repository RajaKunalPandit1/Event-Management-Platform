import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

/**
 * ForgotPassword component
 * 
 * This component allows users to request a password reset link by entering their registered email address.
 * It handles input changes, submits the request to the backend, and displays success or error messages.
 * 
 * @component
 */
const ForgotPassword = () => {
    /**
     * @state {string} email - The email address entered by the user.
     */
    const [email, setEmail] = useState("");

    /**
     * @state {string} message - Success message to display after email is sent.
     */
    const [message, setMessage] = useState("");

    /**
     * @state {string} error - Error message to display if sending the reset link fails.
     */
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /**
     * Handles change in the email input field.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    /**
     * Handles form submission to request a password reset link.
     * Sends the user's email to the backend and navigates to the login page on success.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        
        try {
            const response = await axios.post(`${BASE_URL}/api/password-reset/`, { email }, {
                headers: { "Content-Type": "application/json" }
            });
            
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 5000);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2 col-xl-7 offset-xl-2">
                    <div className="card shadow">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1661774796613-e744c2dc0467?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzZXR8ZW58MHx8MHx8fDA%3D"
                            alt="Reset Password Banner"
                            className="card-img-top"
                        />
                        <div className="card-body">
                            <h5 className="card-title text-center">Forgot Password</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button className="btn btn-warning w-100" type="submit">Send Reset Link</button>

                                {message && <p className="text-center mt-3 text-success">{message}</p>}
                                {error && <p className="text-center mt-3 text-danger">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;