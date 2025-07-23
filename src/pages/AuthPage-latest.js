import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
  Snackbar,
  Alert,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [toast, setToast] = useState({ open: false, msg: '', severity: 'info' });

  const { setAuth, setUserEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  const isValidPassword = (pwd) => {
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    return pwd.length >= 8 && hasLetters && hasNumbers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !confirmPassword)) {
      setToast({ open: true, msg: 'Please fill all required fields.', severity: 'error' });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setToast({ open: true, msg: 'Passwords do not match.', severity: 'error' });
      return;
    }

    if (!isLogin && !isValidPassword(password)) {
      setToast({
        open: true,
        msg: 'Password must be at least 8 characters long and include both letters and numbers.',
        severity: 'error',
      });
      return;
    }

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await axios.post('https://crackify-backend.onrender.com/login', formData);
        setAuth(res.data.access_token);
        setUserEmail(email);
        navigate('/dashboard');
      } else {
        await axios.post('https://crackify-backend.onrender.com/register', { email, password });
        setIsLogin(true);
        setToast({ open: true, msg: 'Registered successfully! Please log in.', severity: 'success' });
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Authentication failed.';
      setToast({ open: true, msg, severity: 'error' });
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      const res = await axios.post('https://crackify-backend.onrender.com/login_google', { email });
      setAuth(res.data.access_token);
      setUserEmail(email);
      navigate('/dashboard');
    } catch (err) {
      setToast({ open: true, msg: 'Google login failed.', severity: 'error' });
    }
  };

  const handleSendReset = async () => {
    if (!resetEmail) {
      setToast({ open: true, msg: 'Enter your email to reset password.', severity: 'warning' });
      return;
    }
    try {
      await axios.post('https://crackify-backend.onrender.com/send_reset_link', { email: resetEmail });
      setToast({ open: true, msg: '✅ Reset link sent to your email.', severity: 'success' });
      setTimeout(() => {
        setShowForgot(false);
        setResetEmail('');
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to send reset link.';
      setToast({ open: true, msg, severity: 'error' });
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
          <div className="tagline">
            Master your interviews with AI-powered real-time assistance
          </div>
          <div className="features">
            <div className="feature"><div className="feature-icon">✓</div><span>Real-time coaching</span></div>
            <div className="feature"><div className="feature-icon">✓</div><span>Smart suggestions</span></div>
            <div className="feature"><div className="feature-icon">✓</div><span>Analytics</span></div>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-tabs">
            <button className={`form-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
            <button className={`form-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Register</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 className="form-title">{isLogin ? 'Welcome back' : 'Create account'}</h2>
              <p className="form-subtitle">{isLogin ? 'Sign in to your account' : 'Start your journey with Crackify AI'}</p>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            )}

            {isLogin && (
              <div className="forgot-password">
                <a href="#" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>Forgot your password?</a>
              </div>
            )}

            <button type="submit" className="primary-button">{isLogin ? 'Sign In' : 'Create Account'}</button>

            <div className="switch-form">
              {isLogin ? (
                <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Register</a></>
              ) : (
                <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Login</a></>
              )}
            </div>
          </form>

          <Box mt={2} textAlign="center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setToast({ open: true, msg: 'Google login failed.', severity: 'error' })}
              useOneTap
            />
          </Box>

          {showForgot && (
            <Box mt={3}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Reset Password</Typography>
              <TextField
                fullWidth
                label="Enter your registered email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSendReset}>Send Reset Link</Button>
            </Box>
          )}
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

export default AuthPage;
