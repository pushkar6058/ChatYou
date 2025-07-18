import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Box, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';

const Home = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
      sx={{
        background: 'linear-gradient(135deg, #f0f4ff, #dbeafe)',
        padding: '2rem',
      }}
    >
      <ChatIcon sx={{ fontSize: 80, color: '#3b82f6', mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" mb={1} color="#1e3a8a">
        Welcome to HelloYou
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Select a friend to start chatting.
      </Typography>
      <GroupIcon sx={{ fontSize: 50, color: '#60a5fa' }} />
    </Box>
  );
};

export default AppLayout()(Home);
