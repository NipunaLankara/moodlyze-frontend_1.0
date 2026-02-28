import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../services/user.service.ts";
import type { UserProfileRequest } from "../../types/user.types.ts";
import "./UserProfile.css";
import Navbar from "../../../../components/Navbar/Navbar.tsx";

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
    const [pageLoading, setPageLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const res = await getUserProfile();
            setProfile(res.data.data);
            setOriginalEmail(res.data.data.email);
        } catch {
            alert("Failed to load profile");
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setSaved(false);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(profile);
            if (profile.email !== originalEmail) {
                navigate("/verify-email-change", { state: { email: profile.email } });
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch {
            alert("Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    // Initials avatar
    const initials = profile.name
        ? profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const emailChanged = profile.email !== originalEmail;

    return (
        <div className="up-shell">
            <Navbar />
            <div className="up-body">

                {pageLoading ? (
                    <div className="up-page-loading">
                        <div className="up-page-spinner" />
                        <p>Loading profile…</p>
                    </div>
                ) : (
                    <>
                        {/* Hero banner */}
                        <div className="up-hero">
                            <div className="up-hero__blob up-hero__blob--1" />
                            <div className="up-hero__blob up-hero__blob--2" />
                            <div className="up-avatar">{initials}</div>
                            <div className="up-hero__info">
                                <h2 className="up-hero__name">{profile.name || "Your Name"}</h2>
                                <p className="up-hero__email">{originalEmail}</p>
                                <span className="up-hero__role-badge">
                                    {localStorage.getItem("role") || "USER"}
                                </span>
                            </div>
                        </div>

                        {/* Form card */}
                        <div className="up-card">
                            <div className="up-card__header">
                                <h3 className="up-card__title">Edit Profile</h3>
                                <p className="up-card__sub">Keep your details up to date</p>
                            </div>

                            {saved && (
                                <div className="up-success-banner">
                                    Profile updated successfully!
                                </div>
                            )}

                            {emailChanged && (
                                <div className="up-info-banner">
                                    📧 Email changed — you'll need to verify the new address via OTP.
                                </div>
                            )}

                            <form className="up-form" onSubmit={handleUpdate}>
                                <div className="up-form__grid">
                                    {/* Name */}
                                    <div className="up-field up-field--full">
                                        <label className="up-label">Full Name</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon">👤</span>
                                            <input
                                                className="up-input"
                                                name="name"
                                                value={profile.name}
                                                placeholder="Your full name"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="up-field up-field--full">
                                        <label className="up-label">
                                            Email Address
                                            {emailChanged && (
                                                <span className="up-changed-tag">Changed — OTP required</span>
                                            )}
                                        </label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon">✉️</span>
                                            <input
                                                className={`up-input ${emailChanged ? "up-input--changed" : ""}`}
                                                name="email"
                                                type="email"
                                                value={profile.email}
                                                placeholder="Email address"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="up-field">
                                        <label className="up-label">Address</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon">📍</span>
                                            <input
                                                className="up-input"
                                                name="address"
                                                value={profile.address}
                                                placeholder="Your address"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div className="up-field">
                                        <label className="up-label">Contact Number</label>
                                        <div className="up-input-wrap">
                                            <span className="up-input-icon">📞</span>
                                            <input
                                                className="up-input"
                                                name="contactNumber"
                                                value={profile.contactNumber}
                                                placeholder="Phone number"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="up-form__footer">
                                    <button
                                        type="submit"
                                        className="up-save-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <><span className="up-spinner" /> Saving…</>
                                        ) : emailChanged ? (
                                            "Save & Verify Email →"
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;