import { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/auth.service";
import "./css/ResetPassword.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = (location.state as { email?: string })?.email || "";

    const [email, setEmail] = useState(emailFromState);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleDigitChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0)
            inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        text.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        inputRefs.current[Math.min(text.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const otpString = otp.join("");
        if (!email || otpString.length < 6 || !newPassword) {
            setError("Please fill all fields correctly.");
            return;
        }
        setLoading(true);
        try {
            await resetPassword({ email, otp: otpString, newPassword });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.data || "Invalid OTP or expired. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rp-page">
            <div className="rp-blob rp-blob--1" />
            <div className="rp-blob rp-blob--2" />
            <div className="rp-blob rp-blob--3" />

            <div className="rp-card">
                <div className="rp-icon-wrap">
                    <span className="rp-icon">🔐</span>
                </div>

                <div className="rp-header">
                    <h1 className="rp-title">Reset Password</h1>
                    <p className="rp-subtitle">
                        Enter the 6-digit code sent to your email and choose a new password.
                    </p>
                </div>

                {success && (
                    <div className="rp-alert rp-alert--success">
                        <span className="rp-alert__icon">✅</span>
                        Password reset successful! Redirecting…
                    </div>
                )}
                {error && (
                    <div className="rp-alert rp-alert--error">
                        <span className="rp-alert__icon">⚠️</span>
                        {error}
                    </div>
                )}

                <form className="rp-form" onSubmit={handleSubmit}>
                    {!emailFromState && (
                        <div className="rp-field">
                            <label className="rp-label">EMAIL ADDRESS</label>
                            <div className="rp-input-wrap">
                                <span className="rp-input-icon">✉️</span>
                                <input className="rp-input" type="email"
                                       placeholder="you@example.com" value={email}
                                       onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>
                    )}

                    <div className="rp-field">
                        <label className="rp-label">VERIFICATION CODE</label>
                        <div className="rp-otp-row">
                            {otp.map((digit, index) => (
                                <input key={index}
                                       ref={(el) => { inputRefs.current[index] = el; }}
                                       className={`rp-otp-input${digit ? " filled" : ""}`}
                                       type="text" inputMode="numeric" maxLength={1}
                                       value={digit} placeholder="·"
                                       onChange={(e) => handleDigitChange(index, e.target.value)}
                                       onKeyDown={(e) => handleKeyDown(index, e)}
                                       onPaste={index === 0 ? handlePaste : undefined}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="rp-field">
                        <label className="rp-label">NEW PASSWORD</label>
                        <div className="rp-input-wrap">
                            <span className="rp-input-icon">🔒</span>
                            <input className="rp-input" type="password"
                                   placeholder="Enter new password" required
                                   value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                    </div>

                    <button className="rp-submit" disabled={loading || success}>
                        {loading
                            ? <><span className="rp-spinner" /> Resetting…</>
                            : <>Reset Password <span className="rp-submit__arrow">→</span></>
                        }
                    </button>
                </form>

                <div className="rp-footer">
                    <Link to="/login" className="rp-back-link">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;