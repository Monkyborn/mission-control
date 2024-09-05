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
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mission/:id" element={<MissionDetail />} />
        <Route path="/teleoperation/:id" element={<RobotTeleoperation />} />
        {/* Altri percorsi qui */}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
