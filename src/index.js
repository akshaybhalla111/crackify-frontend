import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 🔐 Replace with your real Google OAuth client ID
const GOOGLE_CLIENT_ID = '789176348311-s7h87dbbg2idccl498nh2lbba7qh45ai.apps.googleusercontent.com';

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
