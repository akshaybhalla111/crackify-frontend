import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUI } from '../UIContext';
import { API_BASE_URL } from "../config";

function SubscriptionPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { fetchSubscriptionStatus } = useUI();

  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [liveSessionsRemaining, setLiveSessionsRemaining] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!auth) navigate('/login');
  }, [auth]);

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(`${API_BASE_URL}/subscription_status`, {
        headers: { 'Authorization': `Bearer ${auth}` }
      });
      const data = await response.json();
      setSubscriptionStatus(data.subscription_status);
      setLiveSessionsRemaining(data.live_sessions_remaining);
    };

    fetchStatus();
  }, [auth]);

  const currentPlan = !subscriptionStatus || liveSessionsRemaining === 0
    ? 'Free Plan'
    : subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1) + ' Plan';

  const plans = [
    {
      title: 'Free Plan',
      basePrice: 0,
      gst: 0,
      features: [
        'Try 10-minute Mock Interviews',
        'View Session History',
        'Limited Question Types',
        'No Full Interview Sessions',
        'Basic AI Support'
      ]
    },
    {
      title: 'Basic Plan',
      basePrice: 299,
      gst: parseFloat((299 * 0.18).toFixed(2)),
      features: [
        '3 Full-Length AI Interviews',
        'All Basic Features Included',
        'Advanced AI Answer Feedback',
        'View Your Session History',
        'Priority Email Support'
      ]
    },
    {
      title: 'Pro Plan',
      basePrice: 599,
      gst: parseFloat((599 * 0.18).toFixed(2)),
      features: [
        '8 Full-Length AI Interviews',
        'All Basic Features Included',
        'All Question Types (HR, Coding, Scenario, Conceptual)',
        'Advanced AI Answer Feedback',
        'Extended Session History',
        'Early Access to New Features',
        'Premium Support & Insights'
      ]
    }
  ];

  plans.forEach(plan => {
    plan.total = parseFloat((plan.basePrice + plan.gst).toFixed(2));
  });

  const handleSubscribe = async (plan) => {
    if (plan.total === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/create_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.total })
      });

      const { order_id, razorpay_key } = await response.json();

      const options = {
        key: razorpay_key,
        amount: Math.round(plan.total * 100),
        currency: 'INR',
        name: 'Crackify AI',
        description: `Subscription for ${plan.title}`,
        order_id: order_id,
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/verify_payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                selected_plan: plan.title.toLowerCase().split(' ')[0]
              })
            });

            if (verifyResponse.ok) {
              await fetchSubscriptionStatus();
              alert('🎉 Payment verified and subscription activated successfully.');
              navigate('/dashboard');
            } else {
              alert('❌ Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('❌ Payment Verification Error:', err);
            alert('Payment verification failed. Please try again.');
          }
        },
        theme: { color: '#1976d2' }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error('❌ Payment Error:', err);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <Box px={{ xs: 2, sm: 5 }} py={{ xs: 3, sm: 5 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
        Subscription Plans
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Upgrade your plan to unlock unlimited mock interviews and premium features.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + index * 0.2 }}
            >
              <Card
                elevation={currentPlan === plan.title ? 8 : 3}
                sx={{
                  border: currentPlan === plan.title ? '2px solid #1976d2' : '1px solid #ddd',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center">{plan.title}</Typography>
                  <Typography variant="h4" align="center" color="primary" gutterBottom>
                    {plan.basePrice === 0 ? '₹0' : `₹${plan.basePrice} + GST`}
                  </Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, mt: 2 }}>
                    {plan.features.map((feature, idx) => (
                      <Typography key={idx} component="li" sx={{ mb: 1, textAlign: 'center', fontSize: '0.95rem' }}>
                        ✅ {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', mb: 2, px: 2 }}>
                  {currentPlan === plan.title ? (
                    <Button variant="contained" color="success" disabled fullWidth={isMobile}>
                      You are on this plan
                    </Button>
                  ) : (
                    plan.basePrice === 0 ? (
                      <Button variant="outlined" disabled fullWidth={isMobile}>
                        You are on this plan
                      </Button>
                    ) : (
                      <Button variant="outlined" color="primary" onClick={() => handleSubscribe(plan)} fullWidth={isMobile}>
                        Subscribe
                      </Button>
                    )
                  )}
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={5}>
        <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}

export default SubscriptionPage;
