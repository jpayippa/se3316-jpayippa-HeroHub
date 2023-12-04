import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Home from "../components/nonLogged/Home";
import Layout from "../components/Layout/Layout";
import Dashboard from "../components/LoggedIn/DashBoard";
import AdminView from "../components/admin/AdminView";

export const ROOT = "/"
export const LOGIN = "/login"
export const REGISTER = "/register"


export const PROTECTED = "/protected"
export const DASHBOARD = "/protected/dashboard"
export const ADMINVIEW = "/protected/admin/adminview"

export const router = createBrowserRouter([
    { path: ROOT, element: <Home />},
    { path: LOGIN, element: <Login />},
    { path: REGISTER, element: <Register /> },

    {
        path: PROTECTED,
        element: <Layout />,
        children: [
            { 
                path: DASHBOARD, 
                element: <Dashboard />
            },
            { 
                path: ADMINVIEW, 
                element: <AdminView />
            },
           
        ]
    }

])
