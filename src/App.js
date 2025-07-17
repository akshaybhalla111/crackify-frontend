import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material'; // ✅ Import MUI theme provider
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import AnimatedRoutes from './AnimatedRoutes';
import theme from './theme'; // ✅ Import your custom theme

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UIProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
