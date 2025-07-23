import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../UIContext';
import { useAuth } from '../AuthContext';

function LiveSetupPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { subscriptionStatus, liveSessionsRemaining } = useUI();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!auth) navigate('/login');
  }, [auth]);

  useEffect(() => {
    if (liveSessionsRemaining <= 0) navigate('/subscription');
  }, [liveSessionsRemaining, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f6fa"
      px={2}
      py={4}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          🎉 Welcome to Crackify Live Interview
        </Typography>

        <Typography variant="body1" gutterBottom>
          Thank you for subscribing to Crackify AI!
        </Typography>

        <Typography variant="body1" gutterBottom>
          With your current <strong>{subscriptionStatus?.toUpperCase()}</strong> plan, you have{' '}
          <strong>{liveSessionsRemaining}</strong> live interview session
          {liveSessionsRemaining > 1 ? 's' : ''} remaining.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          In your live interview, Crackify AI will listen, transcribe the questions, and generate ideal answers in real-time — all while you focus on acing the conversation.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click below to get started with your personalized interview experience.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth={isMobile}
          onClick={() => navigate('/live-setup-form')}
        >
          Start Live Interview
        </Button>
      </Paper>
    </Box>
  );
}

export default LiveSetupPage;
