import React from 'react';
import { VscAccount } from "react-icons/vsc";
import './NavBar.css'; // Import the CSS file for styling

const NavBar = ({ loggedin = false }) => {
    return (
        <nav className="top-nav-bar">
            <div className="app-name">Hero Hub</div>
            <div className="dropdown">
                {loggedin ? (
                    // If logged in, show logout option
                    <a href="/logout" className="dropbtn">Logout</a>
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
