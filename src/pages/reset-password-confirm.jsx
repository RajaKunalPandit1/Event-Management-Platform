import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import eye from "@iconify-icons/mdi/eye";
import eyeOff from "@iconify-icons/mdi/eye-off";

const ResetPasswordConfirm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);
    const navigate = useNavigate();

    const { uidb64, token } = useParams();
    console.log("UID:", uidb64, "Token:", token);


    const handleChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleToggle = () => {
        setType(type === "password" ? "text" : "password");
        setIcon(type === "password" ? eye : eyeOff);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/password-reset/${uidb64}/${token}/`, { new_password: newPassword }, {
                headers: { "Content-Type": "application/json" }
            });

            setMessage("Password reset successful. Redirecting to login...");
            setTimeout(() => navigate("/login"), 5000);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to reset password. Please try again.");
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
                            <h5 className="card-title text-center">Set New Password</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            type={type}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="input-group-text" onClick={handleToggle}>
                                            <Icon icon={icon} />
                                        </span>
                                    </div>
                                </div>
                                <button className="btn btn-warning w-100" type="submit">Reset Password</button>
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

export default ResetPasswordConfirm;