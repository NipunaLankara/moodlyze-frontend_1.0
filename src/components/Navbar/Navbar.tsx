import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role  = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const firstName = email ? email.split("@")[0] : "";

    const navLinks = [
        { to: "/tasks/add",         label: "Dashboard",    icon: "🏠" },
        { to: "/tasks",             label: "My Tasks",     icon: "📋" },
        { to: "/analyze/schedule",  label: "Schedule",     icon: "📅" },
        { to: "/reminders",         label: "Reminders",    icon: "⏰" },
        { to: "/profile",           label: "Profile",      icon: "👤" },
    ];

    return (
        <>
            <nav className="navbar">

                {/* ── Logo ── */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-icon">🧠</span>
                    <span className="navbar__logo-text">Moodlyze</span>
                </Link>

                {/* ── Nav links (authenticated only) ── */}
                {token && (
                    <div className="navbar__links">
                        {navLinks.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `navbar__link ${isActive ? "navbar__link--active" : ""}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                )}

                {/* ── Right side actions ── */}
                <div className="navbar__actions">
                    {!token ? (
                        <>
                            <Link to="/login" className="navbar__action-link">Login</Link>
                            <Link to="/sign_up" className="navbar__cta">Get Started</Link>
                        </>
                    ) : (
                        <>
                            {/* User pill */}
                            <div className="navbar__user">
                                <div className="navbar__user-avatar">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                                <span className="navbar__user-name">{firstName}</span>
                                {role && (
                                    <span className={`navbar__role-badge ${role === "ADMIN" ? "navbar__role-badge--admin" : ""}`}>
                                        {role}
                                    </span>
                                )}
                            </div>

                            {/* Logout */}
                            <button onClick={logout} className="navbar__logout">
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* ── Mobile hamburger ── */}
                {token && (
                    <button
                        className={`navbar__hamburger ${mobileOpen ? "navbar__hamburger--open" : ""}`}
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                )}
            </nav>

            {/* ── Mobile drawer ── */}
            {token && mobileOpen && (
                <div className="navbar__mobile-drawer" onClick={() => setMobileOpen(false)}>
                    <div className="navbar__mobile-inner" onClick={e => e.stopPropagation()}>

                        <div className="navbar__mobile-user">
                            <div className="navbar__user-avatar navbar__user-avatar--lg">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="navbar__mobile-name">{firstName}</p>
                                <p className="navbar__mobile-email">{email}</p>
                            </div>
                        </div>

                        <nav className="navbar__mobile-links">
                            {navLinks.map(({ to, label, icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `navbar__mobile-link ${isActive ? "navbar__mobile-link--active" : ""}`
                                    }
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="navbar__mobile-link-icon">{icon}</span>
                                    {label}
                                </NavLink>
                            ))}
                        </nav>

                        <button onClick={() => { logout(); setMobileOpen(false); }} className="navbar__mobile-logout">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;