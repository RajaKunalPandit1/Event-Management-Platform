import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordConfirm = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { userId, token } = useParams();
    // const userId = parseInt(user_id, 10);  // Get parameters from URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // console.log("User ID:", user_id);
        // console.log("Token:", token);
        try {

            const response = await axios.post(`http://127.0.0.1:8000/api/reset-password-confirm/${userId}/${token}/`, {
                new_password: password,
            });

            if (response.status === 200) {
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login"); // Redirect to login page
                }, 2000);
            }
        } catch (error) {
            setMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title text-center">Set New Password</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button className="btn btn-primary w-100" type="submit">
                                    Reset Password
                                </button>

                                {message && <p className="text-center mt-3 text-success">{message}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordConfirm;