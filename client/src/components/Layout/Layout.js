import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/Navbar';
import { LOGIN } from '../../router/Approuter';

export default function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
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
            <NavBar loggedin={isAuthenticated} />
            {isAuthenticated ? <Outlet /> : null}
        </>
    );
}
