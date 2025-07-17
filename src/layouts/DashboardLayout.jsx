// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const [isDarkMode, setDarkMode] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }} className={isDarkMode ? 'dark' : ''}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <Box sx={{ flexGrow: 1, ml: isCollapsed ? '64px' : '256px', transition: 'margin 0.3s' }}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={() => setDarkMode(!isDarkMode)} />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
