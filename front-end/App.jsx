import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import "./public/scss/styles.scss";

import Analysis from "./pages/Analysis.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

import MetricsDashboard from "./pages/MetricsDashboard.jsx";

const RoutesWithNavigation = () => {
  return (
    <div>
      <NavBar />
      <Outlet /> {/* Render child routes here */}
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <div className="container">
      <main>
        <Routes>
          <Route path="/" element={<RoutesWithNavigation />}>
            <Route index element={<LandingPage />} />
            <Route path="/metricsdoahboard" element={<MetricsDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
