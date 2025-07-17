import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useAuth } from './AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatPage() {
  const { auth } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/generate_answer',
        { question },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer('Error generating answer.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Ask a Question</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Generate Answer
          </Button>
        </form>
      </Paper>

      {answer && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>AI Answer</Typography>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </Paper>
      )}
    </Container>
  );
}

export default ChatPage;
