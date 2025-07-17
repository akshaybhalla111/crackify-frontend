// src/UIContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const { auth } = useAuth();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [liveSessionsRemaining, setLiveSessionsRemaining] = useState(0);

  // ✅ Reusable function to fetch subscription info
  const fetchSubscriptionStatus = async () => {
    if (!auth) return;
    try {
      const response = await fetch('http://localhost:8000/subscription_status', {
        headers: { 'Authorization': `Bearer ${auth}` }
      });
      if (!response.ok) throw new Error('Failed to fetch subscription status');
      const data = await response.json();

      setSubscriptionStatus(data.subscription_status);       // e.g., 'free', 'basic', 'pro'
      setLiveSessionsRemaining(data.live_sessions_remaining); // e.g., 0, 1, 2
    } catch (err) {
      console.error('Error fetching subscription status:', err);
    }
  };

  // Automatically fetch subscription on login
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [auth]);

  return (
    <UIContext.Provider value={{
      sidebarVisible,
      setSidebarVisible,
      subscriptionStatus,
      setSubscriptionStatus,
      liveSessionsRemaining,
      setLiveSessionsRemaining,
      fetchSubscriptionStatus // ✅ Exposed to call after payment success
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
