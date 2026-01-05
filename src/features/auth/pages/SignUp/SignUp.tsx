import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import type { RegisterRequest } from "../../types/auth.types";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await registerUser(formData);
            navigate("/verify_otp", {
                state: { email: formData.email }
            });
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <form className="col-md-6" onSubmit={handleSubmit}>
                    <h3 className="mb-4 text-center">Create Account</h3>

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="form-control mb-3"
                        required
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        required
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="form-control mb-3"
                        required
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="contactNumber"
                        placeholder="Phone Number"
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

                    <button type="submit" className="btn btn-primary w-100">
                        Sign Up
                    </button>

                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
