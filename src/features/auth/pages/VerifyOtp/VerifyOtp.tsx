import { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../../services/auth.service";
import type { OtpVerifyRequest } from "../../types/auth.types";
import "./VerifyOtp.css";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = (location.state as { email?: string })?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [email, setEmail] = useState(emailFromState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle each digit box
    const handleDigitChange = (index: number, value: string) => {
        // Only allow single digit
        const digit = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError("");

        // Auto-move to next box
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace — move to previous box
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste — fill all boxes at once
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);
        // Focus last filled box
        const lastIndex = Math.min(pasted.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const otpString = otp.join("");
        if (!email || otpString.length < 6) {
            setError("Please enter your email and the 6-digit OTP.");
            return;
        }

        const data: OtpVerifyRequest = { email, otp: otpString };
        setLoading(true);

        try {
            const response = await verifyOtp(data);
            console.log("OTP Verified:", response.data);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1800);
        } catch (error: any) {
            console.error("OTP verification failed:", error.response?.data || error.message);
            setError("Invalid OTP. Please check and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-page">
            {/* Background blobs */}
            <div className="otp-blob otp-blob--1" />
            <div className="otp-blob otp-blob--2" />

            {/* Popup card */}
            <div className="otp-popup">

                {/* Icon */}
                <div className="otp-popup__icon-ring">
                    <span className="otp-popup__icon">📩</span>
                </div>

                <h1 className="otp-popup__title">Check your email</h1>
                <p className="otp-popup__desc">
                    We sent a 6-digit verification code to<br />
                    <strong>{email || "your email"}</strong>
                </p>

                {/* Success state */}
                {success && (
                    <div className="otp-success-banner">
                        <span>✅ Verified! Redirecting to login…</span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="otp-error-banner">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="otp-form">

                    {/* Email field — only show if not pre-filled */}
                    {!emailFromState && (
                        <div className="otp-email-field">
                            <label className="otp-label">Email address</label>
                            <input
                                type="email"
                                className="otp-input-text"
                                value={email}
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {/* 6-digit OTP boxes */}
                    <div className="otp-digits" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleDigitChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`otp-digit-box ${digit ? "otp-digit-box--filled" : ""}`}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {/* Verify button */}
                    <button
                        type="submit"
                        className="otp-submit"
                        disabled={loading || success || otp.join("").length < 6}
                    >
                        {loading ? (
                            <>
                                <span className="otp-spinner" />
                                Verifying…
                            </>
                        ) : success ? (
                            "✅ Verified!"
                        ) : (
                            "Verify OTP"
                        )}
                    </button>
                </form>

                {/* Resend */}
                <p className="otp-resend">
                    Didn't receive a code?{" "}
                    <Link to="/sign_up" className="otp-resend__link">
                        Resend OTP
                    </Link>
                </p>

                {/* Back to login */}
                <p className="otp-back">
                    <Link to="/login" className="otp-back__link">
                        ← Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;