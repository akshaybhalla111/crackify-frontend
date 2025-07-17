// src/pages/MockInterviewIntroPage.js
import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MockInterviewIntroPage() {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', px: 3, bgcolor: '#f7f9fc' }}>
      <Card sx={{ maxWidth: 600, p: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight={600} textAlign="center">
            🎤 Crackify Mock Interview
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, fontSize: '1.05rem' }}>
            Practice real interview questions in a simulated environment. You'll receive questions and instant AI-generated feedback.
          </Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ Free 10-minute mock trial for every user
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✅ Real-time system audio transcription & GPT-4 answers
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            ✅ Practice as many times as you like
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/mock-setup-form')}
          >
            Start Your Mock Trial
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MockInterviewIntroPage;
