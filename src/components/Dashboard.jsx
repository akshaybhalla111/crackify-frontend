import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Upload Resume",
      description: "Upload your resume to get personalized interview questions",
      icon: "📄",
      action: "Upload",
      route: "/upload-resume"
    },
    {
      title: "Mock Interview",
      description: "Practice with our AI interviewer in a realistic mock interview",
      icon: "🎯",
      action: "Start",
      route: "/mock-setup"
    },
    {
      title: "Live Interview",
      description: "Transcribe real interviews live using AI",
      icon: "🎙️",
      action: "Join",
      route: "/live-setup"
    },
    {
      title: "Review Sessions",
      description: "Review your transcripts and AI answers",
      icon: "📊",
      action: "View",
      route: "/sessions"
    }
  ];

  const features = [
    { title: "Mock Interviews", subtitle: "Practice with AI", icon: "🎤", color: "#667eea" },
    { title: "Used by 1000s", subtitle: "Trusted by professionals", icon: "👥", color: "#f5576c" },
    { title: "Advanced AI Models", subtitle: "GPT-4 powered interviews", icon: "🧠", color: "#00f2fe" },
    { title: "Top Companies", subtitle: "FAANG & unicorn prep", icon: "🏆", color: "#43e97b" },
    { title: "Immersive Experience", subtitle: "Full-screen interviews", icon: "🖥️", color: "#fa709a" },
    { title: "Completely Private", subtitle: "Secure & undetectable", icon: "🔒", color: "#a8edea" }
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome to Your AI Interview Journey 🚀
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Master your interviews with our advanced AI technology
      </Typography>

      {/* Your Interview Journey - Custom Flex Grid */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Interview Journey
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
          mb: 8
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(25% - 18px)'
              }
            }}
          >
            <Card
              onClick={() => navigate(step.route)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Typography fontSize={36} mb={1}>{step.icon}</Typography>
                <Typography variant="h6" fontWeight={600}>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
                  {step.description}
                </Typography>
                <Button variant="contained" size="small">
                  {step.action}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Feature Cards */}
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Why Choose CracifyAI?
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          mb: 8
        }}
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              width: {
                xs: '100%',
                sm: 'calc(50% - 12px)',
                md: 'calc(33.333% - 16px)'
              }
            }}
          >
            <Card
              sx={{
                background: feature.color,
                color: 'white',
                height: '150px',
                borderRadius: 4,
                textAlign: 'center',
                p: 2,
                '&:hover': {
                  opacity: 0.95,
                  transform: 'scale(1.02)',
                  transition: '0.3s'
                }
              }}
            >
              <CardContent>
                <Typography fontSize={28} mb={1}>{feature.icon}</Typography>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2">{feature.subtitle}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* CTA */}
      <Box
        sx={{
          mt: 8,
          p: 6,
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: 'white',
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to get started? 🎯
        </Typography>
        <Typography variant="h6" gutterBottom>
          Take your first AI mock interview practice session today
        </Typography>
        <Box mt={3}>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', mr: 2 }}>
            Watch Demo
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'white', color: '#667eea' }}
            onClick={() => navigate('/mock-setup')}>
            Start Mock Interview
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
