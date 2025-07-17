// LandingPage.js
import React from 'react';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box sx={{ flex: 1, backgroundColor: '#1976d2', color: 'white', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img
                src="/crackify-logo.png"
                alt="Crackify Logo"
                style={{ width: '120px', height: 'auto' }}
              />
            </Box>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Crackify AI
            </Typography>
            <Typography variant="h5" gutterBottom>
              Real-Time AI Interview Assistant
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Level up your interviews with live transcription, instant AI answers, and session history tracking.
            </Typography>
            <Button variant="contained" color="success" size="large" sx={{ mr: 2 }} onClick={() => navigate('/register')}>
              Sign Up
            </Button>
            <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/login')}>
              Login
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3">🎤</Typography>
                <Typography variant="h6" gutterBottom>Live Transcription</Typography>
                <Typography variant="body2">Real-time system audio transcription with silence detection.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3">💬</Typography>
                <Typography variant="h6" gutterBottom>AI-Powered Answers</Typography>
                <Typography variant="body2">Instant AI answers to your interview questions with smart prompting.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3">📜</Typography>
                <Typography variant="h6" gutterBottom>Session History</Typography>
                <Typography variant="body2">Review, replay, and learn from your past interview sessions anytime.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3">⚡</Typography>
                <Typography variant="h6" gutterBottom>Smart Shortcuts</Typography>
                <Typography variant="body2">Fast keyboard shortcuts for real-time control and productivity.</Typography>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: '#e3f2fd', py: 8 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              How It Works
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3">📝</Typography>
                  <Typography variant="h6" gutterBottom>Setup Interview</Typography>
                  <Typography variant="body2">Enter your company, role, language, and optional resume.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3">🎧</Typography>
                  <Typography variant="h6" gutterBottom>Start Listening</Typography>
                  <Typography variant="body2">Start live system audio capture with silence-based question detection.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3">⚙️</Typography>
                  <Typography variant="h6" gutterBottom>Get AI Answers</Typography>
                  <Typography variant="body2">Receive real-time streamed answers for your interview questions.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3">📂</Typography>
                  <Typography variant="h6" gutterBottom>Review History</Typography>
                  <Typography variant="body2">Access all your past sessions and improve over time.</Typography>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Final Call to Action */}
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <Typography variant="h4" gutterBottom>Start Your Crackify Journey Now!</Typography>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </motion.div>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1976d2', color: 'white', py: 3, textAlign: 'center' }}>
        <Typography variant="body2">© Crackify AI 2025 | All Rights Reserved</Typography>
      </Box>
    </Box>
  );
}

export default LandingPage;
