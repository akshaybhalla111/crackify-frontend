import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import './AuthPage.css'; // ✅ Reuse login/register styling
import { API_BASE_URL } from "../config";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ open: false, msg: '', severity: 'info' });

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  
  const isValidPassword = (pwd) => {
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    return pwd.length >= 8 && hasLetters && hasNumbers;
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setToast({ open: true, msg: 'Please fill both fields.', severity: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ open: true, msg: 'Passwords do not match.', severity: 'error' });
      return;
    }
    
    if (!isValidPassword(newPassword)) {
      setToast({
        open: true,
        msg: 'Password must be at least 8 characters and include both letters and numbers.',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reset_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Reset failed');
      }

      setToast({ open: true, msg: '✅ Password reset successful!', severity: 'success' });
      setTimeout(() => {
        navigate('/auth'); // or '/login'
      }, 3000);
    } catch (err) {
      setToast({ open: true, msg: err.message, severity: 'error' });
    }
  };

  return (
    <div className="auth-page-body">
      <div className="container">
        <div className="left-panel">
          <div className="logo-only">
            <div className="logo-wrapper">
              <img src="/logo.jpg" alt="Crackify Logo" className="auth-logo-img" />
            </div>
          </div>
          <div className="tagline">Reset your password securely</div>
          <div className="features">
            <div className="feature"><div className="feature-icon">✓</div><span>Token-secured reset</span></div>
            <div className="feature"><div className="feature-icon">✓</div><span>No login required</span></div>
            <div className="feature"><div className="feature-icon">✓</div><span>Quick account recovery</span></div>
          </div>
        </div>

        <div className="right-panel">
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Reset Password</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Set a new password to regain access to your account.
            </Typography>

            <TextField
              label="New Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              sx={{ mb: 3 }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button variant="contained" color="primary" fullWidth onClick={handleReset}>
              Reset Password
            </Button>
          </Box>
        </div>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ResetPasswordPage;
