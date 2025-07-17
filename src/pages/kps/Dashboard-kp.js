// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../UIContext';

function Dashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { subscriptionStatus, setSubscriptionStatus, liveSessionsRemaining, setLiveSessionsRemaining } = useUI();


  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('http://localhost:8000/subscription_status', {
          headers: { 'Authorization': `Bearer ${auth}` }
        });
        const data = await response.json();
        setSubscriptionStatus(data.subscription_status);
        setLiveSessionsRemaining(data.live_sessions_remaining);
      } catch (err) {
        console.error('Error fetching subscription status:', err);
      }
    };

    fetchSubscription();

    // Live session polling every 5 seconds
    const interval = setInterval(fetchSubscription, 5000);

    return () => clearInterval(interval);
  }, [auth]);

  // ✅ Calculate Effective Plan
  const effectivePlan = (subscriptionStatus === 'basic' && liveSessionsRemaining === 0) ||
    (subscriptionStatus === 'pro' && liveSessionsRemaining === 0)
    ? 'free'
    : subscriptionStatus;

  return (
    <Box sx={{ padding: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Crackify AI {effectivePlan === 'pro' && '⭐'}
        </Typography>
        <Typography variant="body1">
          Hello {auth ? 'User' : 'Guest'}, get ready to crack your interviews with real-time AI assistance.
        </Typography>
      </Box>

      {/* Supported Apps Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>
              Supported Platforms
            </Typography>
            <Typography variant="body2" gutterBottom>✔️ Zoom</Typography>
            <Typography variant="body2" gutterBottom>✔️ Google Meet</Typography>
            <Typography variant="body2" gutterBottom>✔️ Microsoft Teams</Typography>
            <Typography variant="body2" gutterBottom>✔️ Any Video Conferencing App (System Audio Supported)</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2204/2204346.png"
            alt="Video Conference"
            style={{ width: '100%', borderRadius: 10 }}
          />
        </Grid>
      </Grid>

      {/* Features List */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>What Crackify Offers:</Typography>
        <ul>
          <li><Typography variant="body1" gutterBottom>✔️ Real-Time System Audio Transcription</Typography></li>
          <li><Typography variant="body1" gutterBottom>✔️ Silence Detection for Question Segmentation</Typography></li>
          <li><Typography variant="body1" gutterBottom>✔️ AI-Powered Step-wise Professional Answers</Typography></li>
          <li><Typography variant="body1" gutterBottom>✔️ Session History, View, Download and Resume Options</Typography></li>
          <li><Typography variant="body1" gutterBottom>✔️ Smart Keyboard Shortcuts</Typography></li>
        </ul>
      </Box>

      {/* Subscription Section */}
      <Box sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#e0f7fa' }}>
          <Typography variant="h6" gutterBottom>Your Subscription</Typography>
          <Typography variant="body2">
            Status: <strong>{effectivePlan.charAt(0).toUpperCase() + effectivePlan.slice(1)} Plan</strong>
          </Typography>

          {effectivePlan !== 'free' && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Remaining Live Interview Sessions: <strong>{liveSessionsRemaining}</strong>
            </Typography>
          )}

          {effectivePlan === 'free' && (
            <>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Upgrade to premium to unlock unlimited mock interviews and extended features.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/subscription')}>
                Upgrade Now
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;
