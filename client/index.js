import React from 'react';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";


const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App />} />
                {/* <App /> */}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);