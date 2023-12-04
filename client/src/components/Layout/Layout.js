import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/Navbar';
import { ADMINVIEW, DASHBOARD, LOGIN } from '../../router/Approuter';

export default function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate(LOGIN);
                return;
            }

            try {
                const response = await fetch('/api/verify-token', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json(); // Assuming the server sends back user data including role
                    if (data.role === 'admin' || data.role === 'GrandAdmin') {
                        navigate(ADMINVIEW);
                    } else {
                        navigate(DASHBOARD);
                    }
                } else {
                    navigate(LOGIN);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                navigate(LOGIN);
            }
        };

        verifyToken();
    }, [navigate]);

    return (
        <>
            <NavBar loggedin={true} /> {/* isAuthenticated is not required if handled by verifyToken */}
            <Outlet />
        </>
    );
}
