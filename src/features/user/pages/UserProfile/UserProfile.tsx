import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile} from "../../services/user.service.ts";
import type {UserProfileRequest} from "../../types/user.types.ts";

const UserProfile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfileRequest>({
        name: "",
        email: "",
        address: "",
        contactNumber: "",
    });

    const [originalEmail, setOriginalEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getUserProfile();
            setProfile(res.data.data);
            setOriginalEmail(res.data.data.email);
        } catch (err) {
            alert("Failed to load profile");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateUserProfile(profile);

            // Email changed → go to OTP verification page
            if (profile.email !== originalEmail) {
                navigate("/verify-email-change", {
                    state: { email: profile.email }
                });
            } else {
                alert("Profile updated successfully");
            }
        } catch (err) {
            alert("Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4">My Profile</h3>

            <form onSubmit={handleUpdate}>
                <input
                    className="form-control mb-3"
                    name="name"
                    value={profile.name}
                    placeholder="Name"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="email"
                    value={profile.email}
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="address"
                    value={profile.address}
                    placeholder="Address"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="contactNumber"
                    value={profile.contactNumber}
                    placeholder="Contact Number"
                    onChange={handleChange}
                />

                <button
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
