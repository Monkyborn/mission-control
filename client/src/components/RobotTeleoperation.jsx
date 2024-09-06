import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import RobotMap from './RobotMap';
import ControlPanel from './ControlPanel';
import Loading from './Loading';
import { fetchRobot } from '../services/api';

// Establishes a connection to the WebSocket server defined by REACT_APP_SOCKET_URL environment variable
const socket = io(process.env.REACT_APP_SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to WebSocket'); // Logs a message when connection is established
});

const RobotTeleoperation = () => {
  const { id } = useParams(); // Extracts the robot ID from the URL parameters

  // Stores the robot's current position (x and y coordinates)
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Stores the fetched robot data
  const [robot, setRobot] = useState(null);

  // Reference to hold the movement interval (used for continuous movement)
  const movementInterval = useRef(null);

  useEffect(() => {
    const getRobot = async () => { // Fetches robot data using the provided ID
      const response = await fetchRobot(id);
      setRobot(response.data);
    };
    getRobot();

    // Emits an event to the server requesting the robot's current position
    socket.emit('get_robot_position', id);

    // Listens for the server's response with the robot's position
    socket.on('robot_position', (newPosition) => {
      setPosition({ x: newPosition.pose_x, y: newPosition.pose_y });
    });

    // Cleanup function to be called when the component unmounts
    return () => {
      socket.off('robot_position'); // Removes the event listener for 'robot_position'
      clearMovement(); // Stops any ongoing robot movement
    };
  }, [id]); // Re-runs the effect whenever the ID changes

  const moveRobot = (direction) => {
    // Emits an event to the server instructing it to move the robot in the specified direction
    socket.emit('move_robot', { robotId: id, direction });
  };

  const startMovement = (direction) => {
    if (!movementInterval.current) { // Checks if there's already an ongoing movement
      moveRobot(direction); // Sends an initial move command
      movementInterval.current = setInterval(() => { // Sets up an interval to send continuous move commands
        moveRobot(direction);
      }, 250); // Interval set to 250 milliseconds
    }
  };

  const clearMovement = () => {
    if (movementInterval.current) { // Checks if there's an ongoing movement interval
      clearInterval(movementInterval.current); // Clears the interval
      movementInterval.current = null; // Resets the reference
    }
  };

  // Displays a loading component while fetching robot data
  if (!robot) return <Loading />;

  return (
    <Container>
      <Typography variant="h4" mt={2} mb={2} gutterBottom>
        Teleoperate Robot: {robot.name}
      </Typography>
      <Box display="flex" alignItems="flex-end" gap={1}>
        <RobotMap position={position} />  {/* Displays the robot's position on the map */}
        <ControlPanel startMovement={startMovement} clearMovement={clearMovement} />  {/* Renders the control panel for movement commands */}
      </Box>
        {/* Add the button to navigate back to the dashboard */}
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/')} 
        style={{ marginTop: '20px' }}
      >
        Back to Dashboard
      </Button>
    </Container>
  );
};

export default RobotTeleoperation;