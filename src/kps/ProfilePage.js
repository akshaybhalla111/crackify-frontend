import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { auth, setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/profile', {
      headers: { Authorization: `Bearer ${auth}` }
    })
      .then(response => setEmail(response.data.email))
      .catch(() => setAuth(null));
  }, [auth, setAuth]);

  const handleLogout = () => {
    setAuth(null);
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5">Welcome {email}</Typography>
        <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => navigate('/chat')}>Start Interview Assistant</Button>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleLogout}>Logout</Button>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
