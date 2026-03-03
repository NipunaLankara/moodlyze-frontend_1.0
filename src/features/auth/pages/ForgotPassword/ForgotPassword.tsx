import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../services/auth.service.ts";
import "./css/ForgotPassword.css";

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
        <div className="fp-page">
            {/* Decorative blobs */}
            <div className="fp-blob fp-blob--1" />
            <div className="fp-blob fp-blob--2" />
            <div className="fp-blob fp-blob--3" />

            <div className="fp-card">
                {/* Icon */}
                <div className="fp-icon-wrap">
                    <span className="fp-icon">🔑</span>
                </div>

                {/* Header */}
                <div className="fp-header">
                    <h1 className="fp-title">Forgot Password?</h1>
                    <p className="fp-subtitle">
                        No worries — enter your email and we'll send you a one-time code to reset it.
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="fp-alert fp-alert--error">
                        <span className="fp-alert__icon">⚠️</span>
                        {error}
                    </div>
                )}
                {message && (
                    <div className="fp-alert fp-alert--success">
                        <span className="fp-alert__icon">✅</span>
                        {message}
                    </div>
                )}

                {/* Form */}
                <form className="fp-form" onSubmit={handleSubmit}>
                    <div className="fp-field">
                        <label className="fp-label" htmlFor="fp-email">Email address</label>
                        <div className="fp-input-wrap">
                            <span className="fp-input-icon">✉️</span>
                            <input
                                id="fp-email"
                                type="email"
                                className="fp-input"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="fp-submit" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="fp-spinner" />
                                Sending OTP…
                            </>
                        ) : (
                            <>
                                <span>Send OTP</span>
                                <span className="fp-submit__arrow">→</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="fp-footer">
                    <Link to="/login" className="fp-back-link">
                        <span>←</span> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;