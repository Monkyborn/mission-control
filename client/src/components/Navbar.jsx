import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h4" // Variant for size, h4 is larger
          component={Link}
          to="/"
          sx={{
            color: 'white', // White color text
            fontWeight: 'bold', // Bold text
            textDecoration: 'none', // No underline for Link
            flexGrow: 1, // Take up available space
            fontSize: '2rem', // Custom font size
          }}
        >
          Mission Control Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
