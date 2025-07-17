import React, { useState } from 'react';
import { Box, Button, Modal, TextField, MenuItem, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const languages = ['English', 'Hindi'];

function InterviewSetupModal({ open, onClose, onSetupComplete, auth }) {
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
      const response = await axios.post('http://localhost:8000/setup_interview', formData, {
        headers: { Authorization: `Bearer ${auth}` }
      });
      onSetupComplete(response.data); // Pass session info to parent
      onClose();
    } catch (err) {
      console.error('Setup failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', width: 400,
        bgcolor: 'background.paper', p: 4, borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom>Setup Your Interview</Typography>

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
            variant="contained" color="primary" fullWidth
            onClick={handleSubmit} disabled={loading}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Start Interview'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default InterviewSetupModal;
