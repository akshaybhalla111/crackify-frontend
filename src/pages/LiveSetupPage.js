import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../UIContext';
import { useAuth } from '../AuthContext';

function LiveSetupPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { subscriptionStatus, liveSessionsRemaining } = useUI();
  

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth]);

  useEffect(() => {
    if (liveSessionsRemaining <= 0) {
      navigate('/subscription');
    }
  }, [liveSessionsRemaining, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f6fa"
      p={4}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 600, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          🎉 Welcome to Crackify Live Interview
        </Typography>

        <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
          Thank you for subscribing to Crackify AI!
        </Typography>

        <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
          With your current <strong>{subscriptionStatus.toUpperCase()}</strong> plan, you have <strong>{liveSessionsRemaining}</strong> live interview session{liveSessionsRemaining > 1 ? 's' : ''} remaining.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          In your live interview, Crackify AI will listen, transcribe the questions, and generate ideal answers in real-time — all while you focus on acing the conversation.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Click below to get started with your personalized interview experience.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/live-setup-form')}
        >
          Start Live Interview
        </Button>
      </Paper>
    </Box>
  );
}

export default LiveSetupPage;
