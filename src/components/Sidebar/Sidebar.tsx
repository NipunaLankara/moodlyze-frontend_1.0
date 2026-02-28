import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    const role = localStorage.getItem("role");

    return (
        <div className="sidebar">

            <NavLink to="/tasks" className="sidebar-link">
                Dashboard
            </NavLink>

            <NavLink to="/tasks/add" className="sidebar-link">
                Add Task
            </NavLink>

            <NavLink to="/analyze/rest" className="sidebar-link">
                Rest Suggestion
            </NavLink>

            <NavLink to="/analyze/schedule" className="sidebar-link">
                Schedule Plan
            </NavLink>

            <NavLink to="/profile" className="sidebar-link">
                My Profile
            </NavLink>

            {role === "ADMIN" && (
                <NavLink to="/testing" className="sidebar-link admin">
                    Admin Panel
                </NavLink>
            )}
        </div>
    );
};

export default Sidebar;