import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { API_BASE_URL } from "../config";

function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/verify-email/${token}`);
        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('failed');
      }
    };
    verify();
  }, [token]);

  return (
    <Box p={5} textAlign="center">
      {status === 'verifying' && (
        <>
          <CircularProgress />
          <Typography mt={2}>Verifying your email...</Typography>
        </>
      )}
      {status === 'success' && (
        <>
          <Typography variant="h4" color="primary" gutterBottom>
            ✅ Email Verified!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 3 }}>
            Go to Login
          </Button>
        </>
      )}
      {status === 'failed' && (
        <>
          <Typography variant="h5" color="error" gutterBottom>
            ❌ Verification link is invalid or expired.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 3 }}>
            Go to Homepage
          </Button>
        </>
      )}
    </Box>
  );
}

export default VerifyEmailPage;
