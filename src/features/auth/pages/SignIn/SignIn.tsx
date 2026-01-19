import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import type { LoginRequest } from "../../types/auth.types";

const SignIn = () => {
    const navigate = useNavigate();

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

            const loginData = res.data.data; // 👈 StandardResponse.data

            const { jwtToken, email, role } = loginData;

            //  Store auth data
            localStorage.setItem("token", jwtToken);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);

            navigate("/testing"); // or /emotion-detect
        }  catch (err: any) {
            const backendError =
                err.response?.data?.data ||     // "Invalid email or password"
                err.response?.data?.massage ||  // "Login Failed"
                "Login failed";
            // console.log("FULL ERROR OBJECT ", err);
            console.log("AXIOS RESPONSE ", err.response);
            console.log("RESPONSE DATA ", err.response?.data);

            setError("TEST ERROR MESSAGE");

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
                        <div className="alert alert-danger">{error}</div>
                    )}

                    <input
                        type="email"
                        name="userEmail"
                        placeholder="Email"
                        className="form-control mb-3"
                        required
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        required
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
