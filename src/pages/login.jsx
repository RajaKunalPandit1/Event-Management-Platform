import { useState } from "react";
import { Link} from "react-router-dom";
import axios from "axios";

import { Icon } from '@iconify/react';
import eye from '@iconify-icons/mdi/eye';
import eyeOff from '@iconify-icons/mdi/eye-off';



/** Login form that be having mail and password field (both required) */

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });

    /** State Hooks for View/Hid password */
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login/", formData, { /** sending form data in JSON */
                headers: { "Content-Type": "application/json" }
            });

            alert(response.data.message); // Show success message
        } catch (error) {
            alert(error.response?.data?.error || "Login failed!"); // Show error message
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
                                        onClick={handleToggle}
                                    >
                                        <Icon icon={icon} size={20} />
                                    </span>
                                </div>

                                <div className="mb-3 text-center">
                                    <Link to="/reset-password" className="text-primary">Forgot your password?</Link>  {/**Redirects to reset-password page */}
                                </div>
                                <button className="btn btn-success w-100" type="submit">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
