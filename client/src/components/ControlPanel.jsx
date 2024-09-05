import React from 'react';
import { Button, Box, Paper } from '@mui/material';
import { ArrowUpward, ArrowDownward, ArrowBack, ArrowForward } from '@mui/icons-material';

const ControlPanel = ({ startMovement, clearMovement }) => (
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 2,
      width: '200px',
      height: '150px',
      flexShrink: 0,
      ml: 2,
    }}
  >
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gap={1}
      width="100%"
      height="100%"
    >
      <Button
        variant="outlined"
        color="primary"
        onMouseDown={() => startMovement('up')}
        onMouseUp={clearMovement}
        onMouseLeave={clearMovement}
        sx={{
          gridColumn: '2 / 3',
          fontSize: '1rem',
          padding: '4px',
          minWidth: '40px',
          minHeight: '40px',
        }}
      >
        <ArrowUpward />
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onMouseDown={() => startMovement('left')}
        onMouseUp={clearMovement}
        onMouseLeave={clearMovement}
        sx={{
          gridColumn: '1 / 2',
          gridRow: '2 / 3',
          fontSize: '1rem',
          padding: '4px',
          minWidth: '40px',
          minHeight: '40px',
        }}
      >
        <ArrowBack />
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onMouseDown={() => startMovement('right')}
        onMouseUp={clearMovement}
        onMouseLeave={clearMovement}
        sx={{
          gridColumn: '3 / 4',
          gridRow: '2 / 3',
          fontSize: '1rem',
          padding: '4px',
          minWidth: '40px',
          minHeight: '40px',
        }}
      >
        <ArrowForward />
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onMouseDown={() => startMovement('down')}
        onMouseUp={clearMovement}
        onMouseLeave={clearMovement}
        sx={{
          gridColumn: '2 / 3',
          fontSize: '1rem',
          padding: '4px',
          minWidth: '40px',
          minHeight: '40px',
        }}
      >
        <ArrowDownward />
      </Button>
    </Box>
  </Paper>
);

export default ControlPanel;
