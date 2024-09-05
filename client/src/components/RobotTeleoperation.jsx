import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import RobotMap from './RobotMap';
import ControlPanel from './ControlPanel';
import Loading from './Loading';
import { fetchRobot } from '../services/api';

const socket = io('http://localhost:5000');

const RobotTeleoperation = () => {
  const { id } = useParams();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [robot, setRobot] = useState(null);
  const movementInterval = useRef(null);

  useEffect(() => {
    const getRobot = async () => {
      const response = await fetchRobot(id);
      setRobot(response.data);
    };
    getRobot();

    socket.emit('get_robot_position', id);
    socket.on('robot_position', (newPosition) => {
      setPosition({ x: newPosition.pose_x, y: newPosition.pose_y });
    });

    return () => {
      socket.off('robot_position');
      clearMovement();
    };
  }, [id]);

  const moveRobot = (direction) => {
    socket.emit('move_robot', { robotId: id, direction });
  };

  const startMovement = (direction) => {
    if (!movementInterval.current) {
      moveRobot(direction);
      movementInterval.current = setInterval(() => {
        moveRobot(direction);
      }, 250);
    }
  };

  const clearMovement = () => {
    if (movementInterval.current) {
      clearInterval(movementInterval.current);
      movementInterval.current = null;
    }
  };

  if (!robot) return <Loading />;

  return (
    <Container>
      <Typography variant="h4" mt={2} mb={2} gutterBottom>
        Teleoperate Robot: {robot.name}
      </Typography>
      <Box display="flex" alignItems="flex-end" gap={1}>
        <RobotMap position={position} />
        <ControlPanel startMovement={startMovement} clearMovement={clearMovement} />
      </Box>
    </Container>
  );
};

export default RobotTeleoperation;
