import React from 'react';
import { Paper, Typography } from '@mui/material';

function TranscriptionBox({ transcript }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Live Transcription</Typography>
      <Typography>{transcript}</Typography>
    </Paper>
  );
}

export default TranscriptionBox;
