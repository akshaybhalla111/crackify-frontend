// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
