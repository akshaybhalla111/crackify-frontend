// src/pages/MockSetupPage.js
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import InterviewSetupModal from '../components/InterviewSetupModal';
import InterviewPreparationModal from '../components/InterviewPreparationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function MockSetupPage() {
  const { auth } = useAuth();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const navigate = useNavigate();

  const handleSetupComplete = (data) => {
    setSetupData(data);
    localStorage.setItem('mock_setup_data', JSON.stringify(data));
    setSetupModalOpen(false);
    setPrepModalOpen(true);
  };

  const handleStartInterview = () => {
    setPrepModalOpen(false);
    navigate('/mock-interview'); // Now go to real interview
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Mock Interview Trial</Typography>
      <Typography paragraph>
        You are about to start a free 10-minute mock interview session using AI. This session will simulate a real interview by transcribing audio and helping you respond to questions.
      </Typography>
      <Typography paragraph>
        You can attempt as many free mock sessions as you want. But each one is limited to 10 minutes.
      </Typography>
      <Button variant="contained" onClick={() => setSetupModalOpen(true)}>Start Your Mock Trial</Button>

      {/* Setup & Preparation modals */}
      <InterviewSetupModal open={setupModalOpen} onClose={() => setSetupModalOpen(false)} onSetupComplete={handleSetupComplete} auth={auth} />
      <InterviewPreparationModal open={prepModalOpen} onClose={() => setPrepModalOpen(false)} onStart={handleStartInterview} />
    </Box>
  );
}

export default MockSetupPage;
