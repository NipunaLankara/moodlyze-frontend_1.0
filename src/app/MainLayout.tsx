import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <div className="layout-shell">
            <Navbar />


            {/* Page content sits below the fixed navbar */}
            <div className="layout-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;