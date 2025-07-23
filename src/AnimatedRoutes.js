// src/AnimatedRoutes.js
import React, { useEffect, useState } from 'react';
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
import Header from './pages/Header';
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
import SupportPage from './pages/SupportPage';
import UploadResumePage from './pages/UploadResumePage';


function AnimatedRoutes() {
  const { auth } = useAuth();
  const { sidebarVisible, setSidebarVisible } = useUI();
  const { subscriptionStatus, liveSessionsRemaining } = useUI();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  useEffect(() => {
    if (location.pathname === '/mock-interview' || location.pathname === '/live-interview') {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [location, setSidebarVisible]);

  return (
    <>
      {auth && sidebarVisible && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div className={`transition-all duration-300 ${auth && sidebarVisible ? 'lg:ml-72' : 'ml-0'} `}>

        {auth && sidebarVisible && (
          <Header setSidebarOpen={setSidebarOpen} />
        )}
        <div className="px-5 pt-6 pb-5">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={!auth ? <PageWrapper><LandingPage /></PageWrapper> : <Navigate to="/dashboard" />} />

              {/* ✅ Replace old login/register with new unified auth route */}
              <Route path="/auth" element={!auth ? <PageWrapper><AuthPage /></PageWrapper> : <Navigate to="/dashboard" />} />
              <Route path="/login" element={<Navigate to="/auth" />} />
              <Route path="/register" element={<Navigate to="/auth" />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              <Route
                path="/dashboard"
                element={
                  auth ? (
                    <motion.div
                      key="dashboard"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 1 }}
                      transition={{ duration: 0 }}
                    >
                      <Dashboard />
                    </motion.div>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
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
              <Route path="/support" element={<PageWrapper><SupportPage /></PageWrapper>} />
              <Route path="/resume" element={<PageWrapper><UploadResumePage /></PageWrapper>} />
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
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
