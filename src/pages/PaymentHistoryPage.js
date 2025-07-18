// src/pages/PaymentHistoryPage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { API_BASE_URL } from "../config";

function PaymentHistoryPage() {
  const { auth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/payment_history`, {
          headers: { Authorization: `Bearer ${auth}` }
        });
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        console.error('Error fetching payment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [auth]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Payment History</Typography>
      {loading ? (
        <CircularProgress />
      ) : payments.length === 0 ? (
        <Typography>No payment records found.</Typography>
      ) : (
        payments.map((payment, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
            <Typography><strong>Plan:</strong> {payment.plan}</Typography>
            <Typography><strong>Amount:</strong> ₹{payment.amount}</Typography>
            <Typography><strong>Payment ID:</strong> {payment.payment_id}</Typography>
            <Typography><strong>Order ID:</strong> {payment.order_id}</Typography>
            <Typography><strong>Date:</strong> {payment.timestamp}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}

export default PaymentHistoryPage;
