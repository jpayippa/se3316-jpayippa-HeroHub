import React from 'react';
import { VscAccount } from "react-icons/vsc";
import { useLogout } from '../../hooks/auth'; // Adjust the path as necessary
import './NavBar.css';
import { ROOT } from '../../router/Approuter';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ loggedin = false }) => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    const handleLogout = async () => {
        localStorage.removeItem('token');
        await logout();
        navigate(ROOT);
    };

    return (
        <nav className="top-nav-bar">
            <div className="app-name">Hero Hub</div>
            <div className="dropdown">
                {loggedin ? (
                    // Call the logout function when the logout link is clicked
                    <button onClick={handleLogout} className="dropbtn">Logout</button>
                ) : (
                    // If not logged in, show login/register options
                    <>
                        <VscAccount className='dropbtn-icon' />
                        <div className="dropdown-content">
                            <a href="/login">Login</a>
                            <a href="/register">Register</a>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
