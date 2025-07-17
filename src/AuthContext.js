import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => localStorage.getItem('authToken') || null);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || null);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('authToken', auth);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [auth]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
