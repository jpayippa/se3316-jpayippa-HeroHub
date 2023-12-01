import React from "react";
import { createBrowserRouter } from "react-router-dom";


export const PROTECTED = "/protected"


export const router = createBrowserRouter([
    { path: "/", component: Home },

    { 
        path: PROTECTED,
    }
])
