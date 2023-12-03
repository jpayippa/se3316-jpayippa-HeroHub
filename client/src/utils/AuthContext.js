//asked chat gpt how to create an authContext

// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      // Check if user is authenticated (e.g., check for a JWT in localStorage)
      const token = localStorage.getItem('jwtToken');
      if (token) {
        // Set the user as authenticated
        setIsAuthenticated(true);
        // Optionally, decode the token to get user details
        // setUser(decodedUserData);
      }
    }, []);
  
    // Function to update the authentication status
    const login = (userData, token) => {
      localStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
      setUser(userData);
    };
  
    const logout = () => {
      localStorage.removeItem('jwtToken');
      setIsAuthenticated(false);
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  