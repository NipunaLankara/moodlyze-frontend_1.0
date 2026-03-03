import { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/auth.service";

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

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
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
            const res = await resetPassword({
                email,
                otp: otpString,
                newPassword
            });

            setSuccess(true);

            setTimeout(() => navigate("/login"), 2000);

        } catch (err: any) {
            setError(
                err?.response?.data?.data ||
                "Invalid OTP or expired. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Reset Password</h1>

                {success && (
                    <div className="alert alert-success">
                        ✅ Password reset successful! Redirecting...
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!emailFromState && (
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleDigitChange(index, e.target.value)}
                                style={{ width: "40px", textAlign: "center" }}
                            />
                        ))}
                    </div>

                    <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button disabled={loading || success}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <p>
                    <Link to="/login">← Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;