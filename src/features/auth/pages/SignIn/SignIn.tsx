import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import type { LoginRequest } from "../../types/auth.types";
import { useAuth } from "../../../../context/AuthContext";

import "../../../../styles/global.css";
import "../../../../styles/Auth.css";

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState<LoginRequest>({
        userEmail: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginUser(formData);
            const { jwtToken, email, role } = res.data.data;
            login(jwtToken, email, role);
            navigate("/tasks");
        } catch (err: any) {
            const backendError =
                err?.response?.data?.data ||
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Invalid email or password";
            setError(backendError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left branding panel */}
            <div className="auth-panel">
                <div className="auth-panel__logo">🧠 Moodlyze</div>
                <h2 className="auth-panel__title">
                    Welcome back!<br />Let's check in on you.
                </h2>
                <p className="auth-panel__desc">
                    Log in to see your tasks, track your mood, and get personalized
                    recommendations based on how you feel today.
                </p>
                <div className="auth-panel__features">
                    <div className="auth-panel__feature">
                        <span className="auth-panel__feature-dot" />
                        Real-time emotion analysis
                    </div>
                    <div className="auth-panel__feature">
                        <span className="auth-panel__feature-dot" />
                        Mood-aware task scheduling
                    </div>
                    <div className="auth-panel__feature">
                        <span className="auth-panel__feature-dot" />
                        Smart rest & focus suggestions
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <div className="auth-card__header">
                        <div className="auth-card__mobile-logo">🧠 Moodlyze</div>
                        <h1 className="auth-card__title">Sign In</h1>
                        <p className="auth-card__subtitle">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger">⚠️ {error}</div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">✉️</span>
                            <input
                                type="email"
                                name="userEmail"
                                placeholder="Email address"
                                className="form-control"
                                required
                                value={formData.userEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🔒</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="form-control"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <p style={{textAlign: "right"}}>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </p>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading && <span className="auth-submit__spinner"/>}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/sign_up">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;