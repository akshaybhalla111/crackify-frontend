import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

function InterviewPreparationModal({ open, onClose, onStart }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 2,
        boxShadow: 24,
        maxWidth: 600,
        width: '90%'
      }}>
        <Typography variant="h5" gutterBottom>You're About to Start a Live Interview</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          ✅ Please make sure your actual interview (Zoom, Google Meet, Microsoft Teams, etc.) is opened in your browser — not in a separate app.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          ✅ In the next step, you will be asked to share your screen. Please select the tab where your interview is happening.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          ✅ Once you share your screen, this Crackify tab will come back in focus, and transcription will begin automatically.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          🔐 Everything is private and secure. This is only for your AI-assisted preparation.
        </Typography>
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={onStart}>Start Live Interview</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default InterviewPreparationModal;