import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MissionDetail from './components/MissionDetail';
import RobotTeleoperation from './components/RobotTeleoperation';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      {/* Navbar component for navigation */}
      <Navbar />

      {/* Routes for different components based on the URL path */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mission/:id" element={<MissionDetail />} />
        <Route path="/teleoperation/:id" element={<RobotTeleoperation />} />
        {/* Other routes can be added here */}
      </Routes>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;