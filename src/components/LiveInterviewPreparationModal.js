import React from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';

function InterviewPreparationModal({ open, onClose, onStart }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 24,
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          You're About to Start a Live Interview
        </Typography>

        <Stack spacing={2} mt={2}>
          <Typography variant="body1">
            ✅ Please make sure your actual interview (Zoom, Google Meet, Microsoft Teams, etc.) is opened in your browser — not in a separate app.
          </Typography>
          <Typography variant="body1">
            ✅ In the next step, you will be asked to share your screen. Please select the tab where your interview is happening.
          </Typography>
          <Typography variant="body1">
            ✅ Once you share your screen, this Crackify tab will come back in focus, and transcription will begin automatically.
          </Typography>
          <Typography variant="body1">
            🔐 Everything is private and secure. This is only for your AI-assisted preparation.
          </Typography>
        </Stack>

        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={onStart} sx={{ minWidth: 180 }}>
            Start Live Interview
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default InterviewPreparationModal;
