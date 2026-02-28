import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmailChangeOtp } from "../../services/user.service.ts";
import "./VerifyEmailChangeOtp.css";

const VerifyEmailChangeOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleDigitChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError("");
        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length < 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }
        setLoading(true);
        try {
            await verifyEmailChangeOtp({ email, otp: otpString });
            setSuccess(true);
            setTimeout(() => navigate("/profile"), 1800);
        } catch {
            setError("Invalid code. Please check and try again.");
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const otpFull = otp.join("").length === 6;

    return (
        <div className="veo-overlay">
            {/* Blurred background blobs */}
            <div className="veo-bg-blob veo-bg-blob--1" />
            <div className="veo-bg-blob veo-bg-blob--2" />

            {/* Popup modal */}
            <div className="veo-modal">

                {/* Close / back button */}
                <button className="veo-close" onClick={() => navigate("/profile")} title="Back to profile">
                    ✕
                </button>

                {/* Icon */}
                <div className={`veo-icon-ring ${success ? "veo-icon-ring--success" : ""}`}>
                    <span className="veo-icon">{success ? "✅" : "📧"}</span>
                </div>

                {success ? (
                    <>
                        <h2 className="veo-title">Email Verified!</h2>
                        <p className="veo-desc">Your new email address has been confirmed. Returning to profile…</p>
                    </>
                ) : (
                    <>
                        <h2 className="veo-title">Verify New Email</h2>
                        <p className="veo-desc">
                            We sent a 6-digit code to<br />
                            <strong className="veo-email">{email}</strong>
                        </p>

                        {error && (
                            <div className="veo-error">⚠️ {error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="veo-form">
                            {/* OTP digit boxes */}
                            <div className="veo-digits" onPaste={handlePaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleDigitChange(i, e.target.value)}
                                        onKeyDown={e => handleKeyDown(i, e)}
                                        className={`veo-digit ${digit ? "veo-digit--filled" : ""}`}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="veo-submit"
                                disabled={loading || !otpFull}
                            >
                                {loading ? (
                                    <><span className="veo-spinner" /> Verifying…</>
                                ) : (
                                    "Confirm Email"
                                )}
                            </button>
                        </form>

                        <p className="veo-footer">
                            Wrong email?{" "}
                            <button className="veo-footer-link" onClick={() => navigate("/profile")}>
                                Go back and edit
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailChangeOtp;