import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Modal,
  Snackbar,
  Alert,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config";

function SessionsPage() {
  const { auth } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [hoveredSession, setHoveredSession] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
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
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
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
    const downloadUrl = `${API_BASE_URL}/download_session/${sessionId}?token=${token}`;
    window.open(downloadUrl, '_blank');
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await fetch(`${API_BASE_URL}/delete_session/${sessionId}`, {
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
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>Sessions</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2}>
          {sessions.map(session => (
            <Box
              key={session.id}
              sx={{
                position: 'relative',
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

              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: isMobile ? 'center' : 'flex-start'
                }}
              >
                {(isMobile || hoveredSession === session.id) && (
                  <>
                    <Button size="small" variant="outlined" onClick={() => handleViewSession(session.id)}>View</Button>
                    <Button size="small" variant="outlined" onClick={() => handleDownloadSession(session.id)}>Download</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteSession(session.id)}>Delete</Button>
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {/* Session Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: 650,
          bgcolor: 'background.paper',
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Session Details</Typography>

          {selectedSession && (
            <>
              <Typography sx={{ mb: 1 }}><strong>Company:</strong> {selectedSession.session.company}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Role:</strong> {selectedSession.session.role}</Typography>
              <Typography sx={{ mb: 2 }}><strong>Date:</strong> {new Date(selectedSession.session.timestamp).toLocaleString()}</Typography>

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Questions & Answers:</Typography>

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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SessionsPage;
