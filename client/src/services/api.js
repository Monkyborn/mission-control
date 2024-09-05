import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
      ? '/api'  // relative URL in production, assuming your backend and frontend are on the same domain
      : 'http://localhost:5000/api' // localhost for development
  });
  

// Missions
export const fetchMissions = () => API.get('/missions');
export const fetchMission = (id) => API.get(`/missions/${id}`);
export const createMission = (newMission) => API.post('/missions', newMission);
export const updateMission = (id, updatedMission) => API.put(`/missions/${id}`, updatedMission);
export const deleteMission = (id) => API.delete(`/missions/${id}`);
export const assignRobotToMission = (missionId, robotId) => API.put(`/missions/${missionId}/assign-robot`, { robotId });
export const removeRobotFromMission = (missionId) => API.put(`/missions/${missionId}/remove-robot`);

// Robots
export const fetchRobots = () => API.get('/robots');
export const fetchRobot = (id) => API.get(`/robots/${id}`);
export const createRobot = (newRobot) => API.post('/robots', newRobot);
export const updateRobot = (id, updatedRobot) => API.put(`/robots/${id}`, updatedRobot);
export const deleteRobot = (id) => API.delete(`/robots/${id}`);
