import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import type { LoginRequest } from "../../types/auth.types";
import { useAuth } from "../../../../context/AuthContext";

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ Hook at top level

    const [formData, setFormData] = useState<LoginRequest>({
        userEmail: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginUser(formData);

            const loginData = res.data.data;
            const { jwtToken, email, role } = loginData;

            // ✅ Save using AuthContext (handles localStorage internally)
            login(jwtToken, email, role);

            // ✅ Navigate after login
            navigate("/testing");

        } catch (err: any) {
            const backendError =
                err?.response?.data?.data ||       // backend message
                err?.response?.data?.massage ||    // fallback if typo
                "Invalid email or password";

            setError(backendError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <form className="col-md-6" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Login</h3>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <input
                        type="email"
                        name="userEmail"
                        placeholder="Email"
                        className="form-control mb-3"
                        required
                        value={formData.userEmail}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center mt-3">
                        Don’t have an account?{" "}
                        <Link to="/sign_up">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;