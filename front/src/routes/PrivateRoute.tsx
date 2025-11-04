import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    element: React.ReactElement;
    requiredRoles?: string[]; // ['ROLE_ADMIN', 'ROLE_MODERATOR'] и т.д.
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Проверка ролей если требуется
    if (requiredRoles && user) {
        const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/" replace />;
        }
    }

    return element;
};

export default PrivateRoute;