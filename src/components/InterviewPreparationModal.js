// src/components/InterviewPreparationModal.js
import React from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';

function InterviewPreparationModal({ open, onStart, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 420, bgcolor: 'background.paper',
        p: 4, borderRadius: 2, boxShadow: 24
      }}>
        <Typography variant="h6" gutterBottom>Before You Begin</Typography>
        <Typography gutterBottom>
          You are about to begin your mock interview session. Please ensure:
        </Typography>
        <ul style={{ marginBottom: 16 }}>
          <li>You have opened your interview source (e.g., YouTube mock video).</li>
          <li>You'll be asked to <strong>share your screen</strong> next.</li>
          <li>Select the tab/window with the mock interview question playing.</li>
        </ul>
        <Typography gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Once ready, click below to begin and share your screen.
        </Typography>
        <Typography sx={{ mt: 2 }}>
          👉 After you select and share your screen, your browser may switch to the shared tab or window.
          <br />
          Once you’ve started sharing, please <strong>return back to this Crackify AI tab</strong> to see your live transcript and AI answers here.
        </Typography>
        <Button variant="contained" fullWidth onClick={onStart}>Start Interview</Button>
      </Box>
    </Modal>
  );
}

export default InterviewPreparationModal;
