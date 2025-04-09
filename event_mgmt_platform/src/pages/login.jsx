import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { Icon } from "@iconify/react";
import eye from "@iconify-icons/mdi/eye";
import eyeOff from "@iconify-icons/mdi/eye-off";

/**
 * Login component handles user authentication.
 * - Collects email and password input from the user.
 * - Allows toggling password visibility.
 * - Submits user credentials to the server for authentication.
 * - On successful login, stores tokens and navigates to the dashboard.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.setAuth - Function to update authentication state in parent component.
 * 
 * @returns {JSX.Element} The rendered Login component.
 */

const Login = ({ setAuth }) => {

    /**
     * State for form data (email and password).
     * @type {[{ email: string, password: string }, Function]}
     */
    const [formData, setFormData] = useState({ email: "", password: "" });

    /**
     * State for input type of password field (password or text).
     * @type {[string, Function]}
     */
    const [type, setType] = useState("password");

    /**
     * State for icon displayed in the password toggle button.
     * @type {[string, Function]}
     */
    const [icon, setIcon] = useState(eyeOff);

    /**
     * State for handling error messages.
     * @type {[string, Function]}
     */
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /**
     * Handles changes in form input fields.
     * Updates form data state based on user input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Toggles password visibility by switching input type and icon.
     */
    const handleToggle = () => {
        setType(type === "password" ? "text" : "password");
        setIcon(type === "password" ? eye : eyeOff);
    };

    /**
     * Handles form submission.
     * Sends a POST request to the backend for user authentication.
     * On success, stores tokens and navigates to the dashboard.
     * On failure, displays an error message.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @async
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors

        try {
            const response = await axios.post(
                `https://52.66.219.20:8000/api/login/`,
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("Response Data:", response.data); // Debugging response
            const { access_token, refresh_token, username, role} = response.data;

            if (access_token && refresh_token && username) {
                // Store tokens and username
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("username", username);
                localStorage.setItem("role", role);
                // localStorage.setItem("user", JSON.stringify({ id, username, role }));
    
                setAuth(true);  // Update authentication state
                navigate("/dashboard");  // Redirect to Dashboard
            } else {
                alert("Invalid response from server!");
            }
        } catch (error) {
            setError("Login Failed! Make Sure to Enter Valid Credentials");
            // alert(error.response?.data?.error || "Login failed!");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2 col-xl-7 offset-xl-2">
                    <div className="card shadow">
                        <img
                            src="https://plus.unsplash.com/premium_photo-1672354234377-38ef695dd2ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGV2ZW50c3xlbnwwfHwwfHx8MA%3D%3D"
                            alt="Login Banner"
                            className="card-img-top"
                        />
                        <div className="card-body">
                            <h5 className="card-title text-center">Login</h5>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
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
                                        className="form-control pe-5"
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
                                            right: "15px",
                                            top: "70%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                        }}
                                        onClick={handleToggle}
                                    >
                                        <Icon icon={icon} size={20} />
                                    </span>
                                </div>

                                <div className="mb-3 text-center">
                                    <Link to="/reset-password" className="text-primary">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <button className="btn btn-success w-100" type="submit">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;