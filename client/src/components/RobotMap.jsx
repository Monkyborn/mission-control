import React from 'react';
import { Box } from '@mui/material';

const RobotMap = ({ position }) => (
  <Box
    sx={{
      position: 'relative',
      width: 400,
      height: 400,
      border: '2px solid #000',
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        transition: 'top 0.1s, left 0.1s',
      }}
    >
      🤖
    </Box>
  </Box>
);

export default RobotMap;
