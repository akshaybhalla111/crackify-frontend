// SessionsPage.js
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Modal, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function SessionsPage() {
  const { auth } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [hoveredSession, setHoveredSession] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:8000/sessions', {
          headers: { Authorization: `Bearer ${auth}` }
        });
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [auth]);

  const handleViewSession = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:8000/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${auth}` }
      });
      const data = await response.json();
      setSelectedSession(data);
      setViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const handleDownloadSession = (sessionId) => {
    const token = encodeURIComponent(auth);
    const downloadUrl = `http://localhost:8000/download_session/${sessionId}?token=${token}`;
    window.open(downloadUrl, '_blank');
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await fetch(`http://localhost:8000/delete_session/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth}` }
      });
      setSessions(sessions.filter(session => session.id !== sessionId));
      setSnackbar({ open: true, message: 'Session deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting session:', error);
      setSnackbar({ open: true, message: 'Failed to delete session.', severity: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Sessions</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        sessions.map(session => (
          <Box
            key={session.id}
            sx={{
              position: 'relative',
              mb: 3,
              p: 2,
              border: '1px solid #ddd',
              borderRadius: '5px',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: 4 }
            }}
            onMouseEnter={() => setHoveredSession(session.id)}
            onMouseLeave={() => setHoveredSession(null)}
          >
            <Typography><strong>Company:</strong> {session.company}</Typography>
            <Typography><strong>Role:</strong> {session.role}</Typography>
            <Typography><strong>Date:</strong> {session.timestamp}</Typography>

            {hoveredSession === session.id && (
              <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleViewSession(session.id)}>View</Button>
                <Button size="small" variant="outlined" onClick={() => handleDownloadSession(session.id)}>Download</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteSession(session.id)}>Delete</Button>
              </Box>
            )}
          </Box>
        ))
      )}

      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 650,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Session Details</Typography>

          {selectedSession && (
            <>
              <Typography sx={{ mb: 1 }}><strong>Company:</strong> {selectedSession.session.company}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Role:</strong> {selectedSession.session.role}</Typography>
              <Typography sx={{ mb: 2 }}><strong>Date:</strong> {new Date(selectedSession.session.timestamp).toLocaleString()}</Typography>

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Questions & Answers:</Typography>

              {selectedSession.questions.length > 0 ? (
                selectedSession.questions.map((q, index) => (
                  <Box key={index} sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9'
                  }}>
                    <Typography sx={{ fontWeight: 'bold', mb: 1 }}>{`Q${index + 1}: ${q.question}`}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{q.answer}</Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ mt: 2, color: 'red' }}>No questions found for this session.</Typography>
              )}
            </>
          )}
        </Box>
      </Modal>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SessionsPage;
