import React from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Box, Typography, Avatar, Button, Divider, Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Videocam as InterviewIcon,
  History as SessionsIcon,
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';




const Sidebar = () => {
  const { auth, setAuth } = useAuth();
  const { subscriptionStatus } = useUI();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  let userEmail = 'Guest';
  if (auth) {
    try {
      const decoded = jwtDecode(auth);
      userEmail = decoded.sub || 'User';
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Mock Interview', icon: <InterviewIcon />, path: '/mock-setup' },
    { label: 'Live Interview', icon: <InterviewIcon />, path: '/live-setup' },
    { label: 'Sessions', icon: <SessionsIcon />, path: '/sessions' },
    // { label: 'Payment History', icon: <PaymentIcon />, path: '/payment-history' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #eee'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 0.5, // spacing between logo & text
          }}
        >
          <Box
            component="img"
            src="/logo.jpg" // or imported `logo`
            alt="Crackify Logo"
            sx={{
              width: 100,
              height: 100,
              borderRadius: '12px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.07)',
              },
              animation: 'fadeInZoom 0.4s ease-in-out',
            }}
          />

          <Typography
            variant="caption"
            sx={{
              fontSize: '0.8rem',
              color: '#666',
              fontStyle: 'italic',
              fontWeight: 500,
              whiteSpace: 'nowrap',       // ⬅️ force one line
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '140px',
            }}
          >
            Interview Assistant
          </Typography>

          <style>
            {`
              @keyframes fadeInZoom {
                0% {
                  opacity: 0;
                  transform: scale(0.92);
                }
                100% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
        </Box>

        {/* Navigation */}
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => navigate(item.path)}
              selected={window.location.pathname === item.path}
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  transform: 'scale(1.02)'
                },
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  fontWeight: 600
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Divider />
        
        <Box sx={{ mt: 'auto', p: 2, pb: 1 }}></Box>
        {/* User Info + Plan */}
          <Box
            sx={{
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              mx: 2,
              my: 1,
              boxShadow: '0px 1px 5px rgba(0,0,0,0.05)',
              '&:hover': { backgroundColor: '#f1f1f1' }
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ mx: 'auto', mb: 1 }}>{userEmail[0]?.toUpperCase() || 'U'}</Avatar>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: '0.9rem',
                color: '#333',
                textAlign: 'center',
                wordBreak: 'break-all',
              }}
            >
              {userEmail}
            </Typography>

            {subscriptionStatus && (
              <Chip
                label={`${subscriptionStatus.charAt(0).toUpperCase()}${subscriptionStatus.slice(1)} Plan`}
                size="small"
                color={
                  subscriptionStatus === 'pro'
                    ? 'success'
                    : subscriptionStatus === 'basic'
                    ? 'primary'
                    : 'default'
                }
                sx={{
                  mt: 1,
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 1.5,
                  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem
              onClick={() => {
                navigate('/profile');
                setAnchorEl(null);
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 20, mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleLogout();
              }}
            >
              <ExitToAppIcon sx={{ fontSize: 20, mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
    </Drawer>
  );
};

export default Sidebar;
