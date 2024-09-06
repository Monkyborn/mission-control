import axios from 'axios';

const API = axios.create({
  // Sets the base URL for API requests based on the environment
  baseURL: process.env.NODE_ENV === 'production'
    ? '/api'  // Relative URL in production (assuming backend and frontend share the same domain)
    : 'http://localhost:5000/api' // Localhost for development
});

// ** Missions API Calls **

// Fetches all missions from the backend API
export const fetchMissions = () => API.get('/missions');

// Fetches a specific mission by its ID
export const fetchMission = (id) => API.get(`/missions/${id}`);

// Creates a new mission by sending the mission data to the backend
export const createMission = (newMission) => API.post('/missions', newMission);

// Updates an existing mission by sending its ID and updated data
export const updateMission = (id, updatedMission) => API.put(`/missions/${id}`, updatedMission);

// Deletes a mission by its ID
export const deleteMission = (id) => API.delete(`/missions/${id}`);

// Assigns a robot to a mission by providing mission ID and robot ID
export const assignRobotToMission = (missionId, robotId) => API.put(`/missions/${missionId}/assign-robot`, { robotId });

// Removes a robot from a mission by providing the mission ID
export const removeRobotFromMission = (missionId) => API.put(`/missions/${missionId}/remove-robot`);

// ** Robots API Calls **

// Fetches all robots from the backend API
export const fetchRobots = () => API.get('/robots');

// Fetches a specific robot by its ID
export const fetchRobot = (id) => API.get(`/robots/${id}`);

// Creates a new robot by sending the robot data to the backend
export const createRobot = (newRobot) => API.post('/robots', newRobot);

// Updates an existing robot by sending its ID and updated data
export const updateRobot = (id, updatedRobot) => API.put(`/robots/${id}`, updatedRobot);

// Deletes a robot by its ID
export const deleteRobot = (id) => API.delete(`/robots/${id}`);