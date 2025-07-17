// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from './AuthContext';

function Navbar() {
  const { setAuth } = useAuth();

  const handleLogout = () => {
    setAuth(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo on the left */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img
            src="/crackify-logo.png"
            alt="Crackify Logo"
            style={{ width: '40px', height: 'auto', marginRight: '10px' }}
          />
          <Typography variant="h6" component={Link} to="/chat" sx={{ textDecoration: 'none', color: 'inherit' }}>
            Crackify AI
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Button color="inherit" component={Link} to="/chat">Chat</Button>
        <Button color="inherit" component={Link} to="/live-interview">Live Interview</Button>
        {/* <Button color="inherit" component={Link} to="/session-history">Session History</Button> */}
        <Button color="inherit" component={Link} to="/Sessions">Session History</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
