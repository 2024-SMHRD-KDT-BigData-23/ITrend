import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(['user_id']);
    const isAuthenticated = cookies['user_id'];
    
    if (!isAuthenticated) {
        alert('로그인이 필요합니다.');
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;