import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUI } from '../UIContext';
import { API_BASE_URL } from "../config";

const languages = ['English', 'Hindi'];

function LiveSetupFormPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { subscriptionStatus, liveSessionsRemaining, fetchSubscriptionStatus } = useUI();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [language, setLanguage] = useState('English');
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (auth) fetchSubscriptionStatus();
  }, [auth]);

  useEffect(() => {
    if (liveSessionsRemaining <= 0) navigate('/subscription');
  }, [liveSessionsRemaining, navigate]);

  const handleStartLiveInterview = async () => {
    if (!company || !role) return;

    const formData = new FormData();
    formData.append('company', company);
    formData.append('role', role);
    formData.append('language', language);
    if (resume) formData.append('resume', resume);
    if (jobDescription) formData.append('job_description', jobDescription);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/setup_interview`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth}` },
        body: formData
      });

      const data = await response.json();
      localStorage.setItem('live_setup_data', JSON.stringify(data));
      navigate('/live-interview');
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error('Live setup failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        width: '100%',
        mx: 'auto',
        mt: 5,
        p: { xs: 2, sm: 3 },
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
        Live Interview Setup
      </Typography>

      <TextField
        fullWidth
        label="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        select
        fullWidth
        label="Preferred Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        sx={{ mb: 2 }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Upload Resume (optional)
        </Typography>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
        />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Upload Job Description (optional)
        </Typography>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setJobDescription(e.target.files[0])}
        />
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStartLiveInterview}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Start Live Interview'}
        </Button>
      </Box>
    </Box>
  );
}

export default LiveSetupFormPage;
