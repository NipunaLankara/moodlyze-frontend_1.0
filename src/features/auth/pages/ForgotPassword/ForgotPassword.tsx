import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {forgotPassword} from "../../services/auth.service.ts";


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await forgotPassword({ email });
            setMessage(res.data.data);

            // Go to reset page with email
            setTimeout(() => {
                navigate("/reset-password", { state: { email } });
            }, 1500);

        } catch (err: any) {
            setError(
                err?.response?.data?.data ||
                "Something went wrong. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Forgot Password</h1>
                <p>Enter your email to receive OTP</p>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />

                    <button disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <p>
                    <Link to="/login">← Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;