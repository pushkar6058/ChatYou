import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" mb={4}>
        The page you are looking for doesn’t exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleBackHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
