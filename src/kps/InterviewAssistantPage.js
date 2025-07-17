import React, { useState, useRef, useEffect, useContext } from 'react';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { AuthContext } from '../AuthContext';

function InterviewAssistantPage() {
  const { auth } = useContext(AuthContext);
  const [transcription, setTranscription] = useState('');
  const [answer, setAnswer] = useState('');
  const videoRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Start Camera
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    // WebSocket Connection
    wsRef.current = new WebSocket('ws://localhost:8000/ws/transcription?token=' + auth);

    wsRef.current.onmessage = (event) => {
      setTranscription(event.data);
    };

    wsRef.current.onerror = () => {
      console.error('WebSocket error');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [auth]);

  const handleGenerate = async () => {
    const response = await fetch('http://localhost:8000/generate_answer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: transcription }),
    });

    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Box display="flex" height="80vh">
        {/* Left Panel */}
        <Box width="30%" display="flex" flexDirection="column" gap={2}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Live Camera</Typography>
            <video ref={videoRef} autoPlay muted style={{ width: '100%' }} />
          </Paper>

          <Paper elevation={3} sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>Live Transcription</Typography>
            <Typography variant="body1" sx={{ height: '150px', overflowY: 'auto' }}>
              {transcription}
            </Typography>
          </Paper>

          <Button variant="contained" color="primary" onClick={handleGenerate}>
            Generate Answer
          </Button>
        </Box>

        {/* Right Panel */}
        <Box width="70%" ml={2}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Generated Answer</Typography>
            <Typography variant="body1">{answer}</Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default InterviewAssistantPage;
