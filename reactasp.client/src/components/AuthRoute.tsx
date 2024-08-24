import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }: any) => {
    const { permissions } = useAuth();
    if (permissions.includes('view')) {
        return children;
    }
    return <Navigate to="/login" />;
};

export const ReverseProtectedRoute = ({ children }: any) => {
    const { permissions } = useAuth();
    if (permissions.includes('')) {
        return children;
    }
    return <Navigate to="/" />;
};