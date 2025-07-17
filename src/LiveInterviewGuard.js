// src/LiveInterviewGuard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LiveInterviewPage from './pages/LiveInterviewPage';
import { Box, CircularProgress, Typography } from '@mui/material';

function LiveInterviewGuard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const checkAndDeductSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/use_live_session', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${auth}` }
        });

        if (response.ok) {
          setAccessGranted(true);
        } else {
          navigate('/subscription');
        }
      } catch (err) {
        console.error('Error checking live session:', err);
        navigate('/subscription');
      } finally {
        setLoading(false);
      }
    };

    checkAndDeductSession();
  }, [auth, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Checking Live Session...</Typography>
      </Box>
    );
  }

  return accessGranted ? <LiveInterviewPage /> : null;
}

export default LiveInterviewGuard;
