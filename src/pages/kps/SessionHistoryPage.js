// SessionHistoryPage.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Container, Grid } from '@mui/material';

function SessionHistoryPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/session_history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching session history:', error);
      }
    }

    fetchSessions();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Session History
      </Typography>

      {sessions.length === 0 ? (
        <Typography variant="body1" align="center">
          No session history found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sessions.map((session) => (
            <Grid item xs={12} key={session.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Question:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {session.question}
                  </Typography>

                  <Typography variant="h6" gutterBottom color="secondary">
                    Answer:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {session.answer}
                  </Typography>

                  <Typography variant="caption" color="textSecondary">
                    {new Date(session.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SessionHistoryPage;
