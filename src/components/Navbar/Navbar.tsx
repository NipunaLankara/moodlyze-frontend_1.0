import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__logo">
                Moodlyze
            </div>

            <div className="navbar__actions">
                <Link to="/login" className="navbar__link">
                    Login
                </Link>
                <Link to="/sign_up" className="navbar__btn">
                    Register
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
