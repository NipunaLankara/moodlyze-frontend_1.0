import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {verifyEmailChangeOtp} from "../../services/user.service.ts";


const VerifyEmailChangeOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        (location.state as { email?: string })?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !otp) {
            alert("Email and OTP are required");
            return;
        }

        try {
            setLoading(true);
            await verifyEmailChangeOtp({ email, otp });
            alert("Email verified successfully");
            navigate("/profile");
        } catch (err) {
            alert("OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Verify New Email</h3>

            <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
                <input
                    className="form-control mb-3"
                    value={email}
                    disabled
                />

                <input
                    className="form-control mb-3"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button
                    className="btn btn-success w-100"
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
};

export default VerifyEmailChangeOtp;
