import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <div className="layout-shell">
            <Navbar />



            <div className="layout-content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;