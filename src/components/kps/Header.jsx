import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';

const Header = ({ title = "Dashboard" }) => {
  return (
    <Box 
      className="bg-white border-b border-gray-200 px-8 py-6"
      sx={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Box className="flex items-center justify-between">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-900 mb-2" sx={{ fontFamily: 'Poppins' }}>
            {title}
          </Typography>
          <Typography variant="h6" className="text-gray-600 font-normal" sx={{ fontFamily: 'Poppins' }}>
            Hi, Akshay 👋 Ready to ace your next interview?
          </Typography>
        </Box>
        
        <Box className="flex items-center space-x-4">
          <Chip 
            label="Pro Plan" 
            color="primary" 
            size="small"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              fontWeight: 600,
              fontFamily: 'Poppins'
            }}
          />
          <Avatar 
            className="w-12 h-12"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              fontFamily: 'Poppins'
            }}
          >
            A
          </Avatar>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
