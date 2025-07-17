// src/pages/LiveSetupFormPage.js
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUI } from '../UIContext';

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
  

  useEffect(() => {
    if (auth) {
      fetchSubscriptionStatus();  // ✅ refresh session count on every mount
    }
  }, [auth]);

  useEffect(() => {
    if (liveSessionsRemaining <= 0) {
      navigate('/subscription');
    }
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/setup_interview`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth}` },
        body: formData
      });

      const data = await response.json();
      
      
      localStorage.setItem('live_setup_data', JSON.stringify(data)); // ✅ Save for retrieval in /live-interview
      
      navigate('/live-interview');
      await fetchSubscriptionStatus(); // ✅ refresh live session count immediately
    } catch (err) {
      console.error('Live setup failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5} p={3} bgcolor="#fff" borderRadius={2} boxShadow={3}>
      <Typography variant="h5" gutterBottom>Live Interview Setup</Typography>

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
          <MenuItem key={lang} value={lang}>{lang}</MenuItem>
        ))}
      </TextField>

      <Typography variant="body2" gutterBottom>Upload Resume (optional)</Typography>
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} style={{ marginBottom: '16px' }} />

      <Typography variant="body2" gutterBottom>Upload Job Description (optional)</Typography>
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setJobDescription(e.target.files[0])} />

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