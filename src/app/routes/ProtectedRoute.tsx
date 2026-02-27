import { Navigate } from "react-router-dom";
import type {JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;