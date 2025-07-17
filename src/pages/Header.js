import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header() {
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          Crackify AI
        </Typography>
        {userEmail && (
          <Button color="inherit" onClick={() => navigate('/profile')}>
            {userEmail}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
