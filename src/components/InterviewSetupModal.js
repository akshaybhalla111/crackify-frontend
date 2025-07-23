import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Stack
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from "../config";

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
      const response = await axios.post(`${API_BASE_URL}/setup_interview`, formData, {
        headers: { Authorization: `Bearer ${auth}` }
      });
      onSetupComplete(response.data);
      onClose();
    } catch (err) {
      console.error('Setup failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: 400 },
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Setup Your Interview
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <TextField
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <TextField
            select
            fullWidth
            label="Preferred Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="body2" gutterBottom>
              Upload Resume (optional)
            </Typography>
            <input
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              accept=".pdf,.doc,.docx"
            />
          </Box>

          <Box>
            <Typography variant="body2" gutterBottom>
              Upload Job Description (optional)
            </Typography>
            <input
              type="file"
              onChange={(e) => setJobDescription(e.target.files[0])}
              accept=".pdf,.doc,.docx"
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Start Interview'
            )}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default InterviewSetupModal;
