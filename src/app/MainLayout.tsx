import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            <nav style={{ padding: 10, background: "#eee" }}>
                <b>Moodlyze</b>
            </nav>

            <div style={{ padding: 20 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;