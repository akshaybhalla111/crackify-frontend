// src/AnimatedRoutes.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from '@mui/material';

// import ChatPage from './ChatPage';
import LiveInterviewGuard from './LiveInterviewGuard';
import LiveInterviewPage from './pages/LiveInterviewPage';
import MockInterviewPage from './pages/MockInterviewPage';
import LandingPage from './pages/LandingPage';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import SessionsPage from './pages/SessionsPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './Sidebar';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import AuthPage from './pages/AuthPage'; // ✅ New AuthPage
import MockInterviewIntroPage from './pages/MockInterviewIntroPage';
import MockInterviewSetupForm from './pages/MockInterviewSetupForm';
import MockSetupPage from './pages/MockSetupPage';
import LiveSetupPage from './pages/LiveSetupPage';
import LiveSetupForm from './pages/LiveSetupForm';
import ResetPasswordPage from './pages/ResetPasswordPage'; 
import VerifyEmailPage from './pages/VerifyEmailPage';

function AnimatedRoutes() {
  const { auth } = useAuth();
  const { sidebarVisible, setSidebarVisible } = useUI();
  const { subscriptionStatus, liveSessionsRemaining } = useUI();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/mock-interview' || location.pathname === '/live-interview') {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [location, setSidebarVisible]);

  return (
    <>
      {auth && sidebarVisible && <Sidebar />}
      <Box sx={{ marginLeft: auth && sidebarVisible ? '240px' : '0px', padding: '20px' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={!auth ? <PageWrapper><LandingPage /></PageWrapper> : <Navigate to="/dashboard" />} />

            {/* ✅ Replace old login/register with new unified auth route */}
            <Route path="/auth" element={!auth ? <PageWrapper><AuthPage /></PageWrapper> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/register" element={<Navigate to="/auth" />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/dashboard" element={auth ? <PageWrapper><Dashboard /></PageWrapper> : <Navigate to="/" />} />
            {/* <Route path="/chat" element={auth ? <PageWrapper><ChatPage /></PageWrapper> : <Navigate to="/" />} /> */}
            <Route path="/mock-interview" element={auth ? <PageWrapper><MockInterviewPage /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/mock-setup" element={auth ? <PageWrapper><MockSetupPage /></PageWrapper> : <Navigate to="/" />} />
            {/* <Route path="/mock-setup-form" element={<PageWrapper><MockInterviewSetupForm /></PageWrapper>} /> */}
            {/* <Route path="/live-interview" element={auth && subscriptionStatus !== 'free' ? <PageWrapper><LiveInterviewGuard /></PageWrapper> : <Navigate to="/subscription" />} /> */}
            <Route path="/live-interview" element={auth ? <PageWrapper><LiveInterviewGuard /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/live-setup" element={auth && subscriptionStatus !== 'free' ? <PageWrapper><LiveSetupPage /></PageWrapper> : <Navigate to="/subscription" />} />
            <Route path="/live-setup-form" element={auth ? <PageWrapper><LiveSetupForm /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/sessions" element={auth ? <PageWrapper><SessionsPage /></PageWrapper> : <Navigate to="/" />} />
            <Route path="/subscription" element={<PageWrapper><SubscriptionPage /></PageWrapper>} />
            <Route path="/payment-history" element={<PageWrapper><PaymentHistoryPage /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><UserProfilePage /></PageWrapper>} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          </Routes>
        </AnimatePresence>
      </Box>
    </>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedRoutes;
