import React, {useState, useEffect, useRef } from 'react';
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import './scss/styles.scss';

import Analysis from "./pages/Analysis.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const App = () => {
    return (
        <div className='container'>
        <main>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/analysis" element ={<Analysis/>} />
            </Routes>
        </main>
        </div>

    )
}

export default App;