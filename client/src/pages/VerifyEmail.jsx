import React from 'react';
// import { verifyEmail } from '../services/auth';
import { Box, Typography, Button, Alert } from '@mui/material';

function VerifyEmail() {
  // Email verification page is no longer needed
  return (
    <Box maxWidth={400} mx="auto" p={3} boxShadow={2} borderRadius={2} className="bg-white text-center">
      <Typography variant="h5" mb={2}>Email verification feature is disabled</Typography>
      <Alert severity="info">You can log in immediately after registration</Alert>
    </Box>
  );
}

export default VerifyEmail;
