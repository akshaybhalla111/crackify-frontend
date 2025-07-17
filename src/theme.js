import { createTheme } from '@mui/material/styles';

// 👇 MUI Theme Configuration with Inter font and Tailwind palette
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#bbdefb',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    background: {
      default: '#fafafa'
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    button: { textTransform: 'none' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontFamily: '"Inter", sans-serif'
        }
      }
    }
  }
});

export default theme;
