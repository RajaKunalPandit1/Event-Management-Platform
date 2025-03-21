import { useState } from "react";
import axios from "axios";

/** This page resets the password and logic is to reverse last 6 digits alphabest (if exists) of email otherwise error if aplhphabets not form*/

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const generateTempPassword = (email) => {
        const username = email.split("@")[0]; // Extract part before @
        const filteredUsername = username.replace(/[^a-zA-Z]/g, ""); 

        if (!filteredUsername) {
            return null; 
        }

        return filteredUsername.length >= 6 
            ? filteredUsername.slice(-6).split("").reverse().join("") 
            : filteredUsername.split("").reverse().join("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            setMessage("Invalid email format!");
            return;
        }

        const tempPassword = generateTempPassword(email);

        if (!tempPassword) {
            setMessage("Invalid email: Must contain alphabetical characters before '@'.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/reset-password/", { email, tempPassword }, {/**sends temp password with asssociated mail */
                headers: { "Content-Type": "application/json" }
            });

            setMessage("A temporary password has been emailed to you.");
        } catch (error) {
            setMessage("Failed to reset password. Please try again.");
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
                            <h5 className="card-title text-center">Reset Password</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button className="btn btn-warning w-100" type="submit">Reset Password</button>

                                {message && <p className="text-center mt-3 text-danger">{message}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
