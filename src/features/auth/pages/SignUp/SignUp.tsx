import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import type { RegisterRequest } from "../../types/auth.types";
import "../../../../styles/global.css";
import "../../../../styles/Auth.css";

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        email: "",
        address: "",
        contactNumber: "",
        password: "",
        userRole: "USER",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await registerUser(formData);
            navigate("/verify_otp", {
                state: { email: formData.email }
            });
        } catch (err: any) {
            console.error("Registration failed", err);
            if (err.response && err.response.data) {
                setError(err.response.data.data || "Registration failed");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="auth-page">
            {/* Left branding panel */}
            <div className="auth-panel">
                <div className="auth-panel__logo">🧠 Moodlyze</div>
                <h2 className="auth-panel__title">
                    Start your<br />wellness journey.
                </h2>
                <p className="auth-panel__desc">
                    Create your free account and discover how your emotions shape your
                    productivity. Get personalized insights from day one.
                </p>
                <div className="auth-panel__features">
                    <div className="auth-panel__feature">
                        <span className="auth-panel__feature-dot" />
                        Free to get started
                    </div>
                    <div className="auth-panel__feature">
                        <span className="auth-panel__feature-dot" />
                        Secure OTP verification
                    </div>
                    <div className="auth-panel__feature">
                        <span className="auth-panel__feature-dot" />
                        Privacy-first approach
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-side">
                <div className="auth-card">
                    <div className="auth-card__header">
                        <div className="auth-card__mobile-logo">🧠 Moodlyze</div>
                        <h1 className="auth-card__title">Create Account</h1>
                        <p className="auth-card__subtitle">Fill in your details to get started</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger">⚠️ {error}</div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-form-grid">
                            <div className="auth-input-wrapper span-2">
                                <span className="auth-input-icon">👤</span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full name"
                                    className="form-control"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="auth-input-wrapper span-2">
                                <span className="auth-input-icon">✉️</span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    className="form-control"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">📍</span>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    className="form-control"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">📞</span>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    placeholder="Phone number"
                                    className="form-control"
                                    required
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
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔐</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    className="form-control"
                                    required
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit">
                            Create Account
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;