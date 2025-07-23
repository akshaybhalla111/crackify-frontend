import React from 'react';
import { Box, Modal, Typography, Button, Stack } from '@mui/material';

function InterviewPreparationModal({ open, onStart, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: 420 },
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Before You Begin</Typography>

          <Typography>
            You are about to begin your mock interview session. Please ensure:
          </Typography>

          <Box component="ul" sx={{ pl: 3, mb: 0 }}>
            <li>You have opened your interview source (e.g., YouTube mock video).</li>
            <li>You’ll be asked to <strong>share your screen</strong> next.</li>
            <li>Select the tab/window with the mock interview question playing.</li>
          </Box>

          <Typography sx={{ fontWeight: 'bold' }}>
            Once ready, click below to begin and share your screen.
          </Typography>

          <Typography variant="body2">
            👉 After you select and share your screen, your browser may switch to the shared tab or window.
            <br />
            Once you’ve started sharing, please <strong>return back to this Crackify AI tab</strong> to see your live transcript and AI answers here.
          </Typography>

          <Button variant="contained" fullWidth onClick={onStart}>
            Start Interview
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default InterviewPreparationModal;
