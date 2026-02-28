import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar__logo">
                <Link to="/" className="logo-link">
                    Moodlyze
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="navbar__links">
                {token && (
                    <>
                        <Link to="/" className="navbar__link">Home</Link>
                        <Link to="/profile" className="navbar__link">Profile</Link>
                        <Link to="/tasks/add" className="navbar__link">Manage Task</Link>
                        <Link to="/tasks" className="navbar__link">View All Tasks</Link>
                    </>
                )}
            </div>

            {/* User / Auth Actions */}
            <div className="navbar__actions">
                {!token ? (
                    <>
                        <Link to="/login" className="navbar__link">
                            Login
                        </Link>
                        <Link to="/sign_up" className="navbar__btn">
                            Get Started
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="navbar__user">
                            👤 {email}
                            {role && (
                                <span className="badge badge--blue" style={{ marginLeft: "0.4rem", fontSize: "0.68rem" }}>
                                    {role}
                                </span>
                            )}
                        </span>
                        <button onClick={logout} className="navbar__logout">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;