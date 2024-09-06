import React from 'react';
import { Box } from '@mui/material';

const RobotMap = ({ position }) => (
  // Creates a container for the robot map with a relative position, fixed width and height, and a border
  <Box
    sx={{
      position: 'relative',
      width: 400,
      height: 400,
      border: '2px solid #000',
      flexShrink: 0,
    }}
  >
    // Creates a box to represent the robot's position within the map container
    <Box
      sx={{
        // Positions the robot based on the provided `position` object (x and y coordinates)
        position: 'absolute',
        top: position.y,
        left: position.x,
        // Applies a transition effect to smoothly animate changes in position
        transition: 'top 0.1s, left 0.1s',
      }}
    >
      🤖
    </Box>
  </Box>
);

export default RobotMap;