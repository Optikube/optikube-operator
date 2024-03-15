import React, {useState, useEffect, useRef } from 'react';
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import './scss/styles.scss';
import HomePage from './components/HomePage';
import Analysis from './components/Analysis';

const App = () => {
    return (
        <div className='container'>
        <main>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/analysis" element ={<Analysis/>} />
            </Routes>
            
        </main>
        </div>

    )
}

export default App;