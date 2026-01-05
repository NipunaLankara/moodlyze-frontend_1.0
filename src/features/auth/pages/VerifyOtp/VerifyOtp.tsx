import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../../services/auth.service";
import type { OtpVerifyRequest } from "../../types/auth.types";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = (location.state as { email?: string })?.email || "";

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState(emailFromState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !otp) {
            alert("Please enter email and OTP");
            return;
        }

        const data: OtpVerifyRequest = { email, otp };

        try {
            const response = await verifyOtp(data);
            console.log("OTP Verified:", response.data);
            alert("OTP Verified Successfully!");
            navigate("/login"); // Redirect to login after successful verification
        } catch (error: any) {
            console.error("OTP verification failed:", error.response?.data || error.message);
            alert("OTP verification failed. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <form className="col-md-6" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Verify OTP</h3>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">OTP</label>
                        <input
                            type="text"
                            className="form-control"
                            value={otp}
                            placeholder="Enter OTP"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Verify OTP
                    </button>

                    <p className="text-center mt-3">
                        Didn't receive OTP? <Link to="/sign_up">Resend OTP</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
