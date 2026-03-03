import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    const role = localStorage.getItem("role");

    return (
        <div className="sidebar">

            {/* === Main Nav === */}
            <span className="sidebar__section-label">Main</span>

            <NavLink to="/tasks" end className="sidebar-link">
                <span className="sidebar-icon">📋</span>
                Dashboard
            </NavLink>

            <NavLink to="/tasks/add" className="sidebar-link">
                <span className="sidebar-icon">➕</span>
                Add Task
            </NavLink>

            <div className="sidebar__divider" />

            {/* === Analysis === */}
            <span className="sidebar__section-label">Analyze</span>

            <NavLink to="/analyze/rest" className="sidebar-link">
                <span className="sidebar-icon">😌</span>
                Rest Suggestion
            </NavLink>

            <NavLink to="/analyze/schedule" className="sidebar-link">
                <span className="sidebar-icon">📅</span>
                Schedule Plan
            </NavLink>

            <div className="sidebar__divider" />

            {/* === Account === */}
            <span className="sidebar__section-label">Account</span>

            <NavLink to="/profile" className="sidebar-link">
                <span className="sidebar-icon">👤</span>
                My Profile
            </NavLink>

            {role === "ADMIN" && (
                <>
                    <div className="sidebar__divider" />
                    <NavLink to="/testing" className="sidebar-link admin">
                        <span className="sidebar-icon">🛡️</span>
                        Admin Panel
                    </NavLink>
                </>
            )}

            {/* === Bottom Mood Card === */}
            <div style={{ flex: 1 }} />
            <div className="sidebar__mood-card">
                <span className="sidebar__mood-emoji">🧘</span>
                Today's mood tracked!
            </div>
        </div>
    );
};

export default Sidebar;