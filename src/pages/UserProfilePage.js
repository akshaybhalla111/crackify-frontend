import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from "../config";

function UserProfilePage() {
  const { auth } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [liveSessionsRemaining, setLiveSessionsRemaining] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let userEmail = 'Guest';
  if (auth) {
    try {
      const decoded = jwtDecode(auth);
      userEmail = decoded?.sub || 'User';
    } catch (err) {
      console.error('❌ Invalid token', err);
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const subRes = await fetch(`${API_BASE_URL}/subscription_status`, {
          headers: { Authorization: `Bearer ${auth}` }
        });
        const subData = await subRes.json();
        setSubscriptionStatus(subData.subscription_status || 'free');
        setLiveSessionsRemaining(subData.live_sessions_remaining || 0);

        const paymentRes = await fetch(`${API_BASE_URL}/payment_history`, {
          headers: { Authorization: `Bearer ${auth}` }
        });
        const payments = await paymentRes.json();
        setPaymentHistory(Array.isArray(payments) ? payments : []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    if (auth) fetchDetails();
    else {
      setPaymentHistory([]);
      setSubscriptionStatus('');
      setLiveSessionsRemaining(0);
    }
  }, [auth]);

  return (
    <Box px={{ xs: 2, sm: 5 }} py={{ xs: 3, sm: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>User Profile</Typography>
        <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom color="primary">
          Hi, {userEmail?.split('@')[0]} 👋
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Subscription: <strong>{subscriptionStatus ? subscriptionStatus.toUpperCase() : 'N/A'}</strong>
            </Typography>
            <Typography variant="h6">
              Live Sessions Remaining: <strong>{liveSessionsRemaining ?? 'N/A'}</strong>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>Payment History</Typography>

        {!Array.isArray(paymentHistory) || paymentHistory.length === 0 ? (
          <Typography>No payments made yet.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, minWidth: 360 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell><strong>Plan</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((p, index) => (
                    <TableRow key={index}>
                      <TableCell>{p.plan?.toUpperCase?.() || 'N/A'}</TableCell>
                      <TableCell>₹{p.amount}</TableCell>
                      <TableCell>{p.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </motion.div>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/subscription'}
          fullWidth={isMobile}
          sx={{
            px: 4,
            py: 1.5,
            transition: '0.3s',
            '&:hover': { backgroundColor: '#1565c0' },
            maxWidth: 300
          }}
        >
          Manage Subscription
        </Button>
      </Box>
    </Box>
  );
}

export default UserProfilePage;
