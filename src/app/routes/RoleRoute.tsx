import { Navigate } from "react-router-dom";
import type {JSX} from "react";

interface Props {
    children: JSX.Element;
    roles: string[];
}

const RoleRoute = ({ children, roles }: Props) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;

    if (!roles.includes(role || "")) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;