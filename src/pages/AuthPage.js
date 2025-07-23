
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';
import {
  Snackbar,
  Alert
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import {
  Input
} from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { API_BASE_URL } from "../config";

export default function AuthPage() {
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

  const isValidPassword = (pwd) => /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !confirmPassword)) {
      return setToast({ open: true, msg: 'Please fill all required fields.', severity: 'error' });
    }
    if (!isLogin && password !== confirmPassword) {
      return setToast({ open: true, msg: 'Passwords do not match.', severity: 'error' });
    }
    if (!isLogin && !isValidPassword(password)) {
      return setToast({
        open: true,
        msg: 'Password must be at least 8 characters long and include both letters and numbers.',
        severity: 'error'
      });
    }

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const res = await axios.post(`${API_BASE_URL}/login`, formData);
        setAuth(res.data.access_token);
        setUserEmail(email);
        navigate('/dashboard');
      } else {
        await axios.post(`${API_BASE_URL}/register`, { email, password });
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
      const res = await axios.post(`${API_BASE_URL}/login_google`, { email: decoded.email });
      setAuth(res.data.access_token);
      setUserEmail(decoded.email);
      navigate('/dashboard');
    } catch {
      setToast({ open: true, msg: 'Google login failed.', severity: 'error' });
    }
  };

  const handleSendReset = async () => {
    if (!resetEmail) return setToast({ open: true, msg: 'Enter your email.', severity: 'warning' });
    try {
      await axios.post(`${API_BASE_URL}/send_reset_link`, { email: resetEmail });
      setToast({ open: true, msg: '✅ Reset link sent.', severity: 'success' });
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
    <div className="min-h-screen w-full bg-gray-50 lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Login to access your dashboard' : 'Sign up to start your journey'}
            </p>
          </div>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setToast({ open: true, msg: 'Google login failed.', severity: 'error' })}
            useOneTap
          />
          <div className="grid gap-2">
            {!isLogin && (
              <div className="grid gap-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {!isLogin && (
              <div className="grid gap-1">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            )}
            {isLogin && (
              <div className="text-right text-sm text-blue-600 cursor-pointer" onClick={() => setShowForgot(true)}>
                Forgot your password?
              </div>
            )}
            <Button type="submit" className="w-full">{isLogin ? 'Login' : 'Register'}</Button>
            <div className="text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <span className="text-blue-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Register' : 'Login'}
              </span>
            </div>
            {showForgot && (
              <div className="grid gap-2 pt-4">
                <Label>Reset Password</Label>
                <Input placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                <Button onClick={handleSendReset} type="button">Send Reset Link</Button>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white p-12 relative">
        <div className="text-center space-y-6">
          <img src="/logo.jpg" alt="Crackify Logo" className="h-24 mx-auto" />
          <h2 className="text-4xl font-bold">Ace Every Interview.</h2>
          <p className="text-xl text-blue-100 max-w-md mx-auto">
            Get real-time AI assistance for mock interviews and live calls.
          </p>
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
