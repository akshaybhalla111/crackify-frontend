import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
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
    navigate('/mock-interview');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: '1.8rem', sm: '2.125rem' } }}
            gutterBottom
          >
            Mock Interview Trial
          </Typography>

          <Typography>
            You are about to start a free 10-minute mock interview session using AI. This session will simulate a real interview by transcribing audio and helping you respond to questions.
          </Typography>

          <Typography>
            You can attempt as many free mock sessions as you want. But each one is limited to 10 minutes.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setSetupModalOpen(true)}
            sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
          >
            Start Your Mock Trial
          </Button>
        </Stack>
      </Box>

      {/* Setup & Preparation modals */}
      <InterviewSetupModal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSetupComplete={handleSetupComplete}
        auth={auth}
      />
      <InterviewPreparationModal
        open={prepModalOpen}
        onClose={() => setPrepModalOpen(false)}
        onStart={handleStartInterview}
      />
    </Container>
  );
}

export default MockSetupPage;
