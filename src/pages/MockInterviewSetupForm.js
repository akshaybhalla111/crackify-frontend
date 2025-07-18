// src/pages/MockInterviewSetupForm.js
import React, { useState } from 'react';
import { Box, Button, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "../config";

const languages = ['English', 'Hindi'];

function MockInterviewSetupForm() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [language, setLanguage] = useState('English');
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!company || !role) return;

    const formData = new FormData();
    formData.append('company', company);
    formData.append('role', role);
    formData.append('language', language);
    if (resume) formData.append('resume', resume);
    if (jobDescription) formData.append('job_description', jobDescription);

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/setup_interview`, formData, {
        headers: { Authorization: `Bearer ${auth}` }
      });

      const sessionData = response.data;
      localStorage.setItem('mock_setup_data', JSON.stringify(sessionData));
      navigate('/mock-interview'); // proceed to actual interview
    } catch (err) {
      console.error('Setup failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
      <Box sx={{ width: 400, p: 4, borderRadius: 3, bgcolor: '#fff', boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>Interview Setup</Typography>

        <TextField fullWidth label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Role" value={role} onChange={(e) => setRole(e.target.value)} sx={{ mb: 2 }} />
        <TextField
          select fullWidth label="Preferred Language"
          value={language} onChange={(e) => setLanguage(e.target.value)} sx={{ mb: 2 }}
        >
          {languages.map((lang) => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
        </TextField>

        <Typography variant="body2" gutterBottom>Upload Resume (optional)</Typography>
        <input type="file" onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" style={{ marginBottom: '16px' }} />

        <Typography variant="body2" gutterBottom>Upload Job Description (optional)</Typography>
        <input type="file" onChange={(e) => setJobDescription(e.target.files[0])} accept=".pdf,.doc,.docx" />

        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Start Interview'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default MockInterviewSetupForm;
