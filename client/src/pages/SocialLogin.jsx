import React, { useState } from 'react';
import { socialLogin } from '../services/auth';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material';

// This is a mock. In production, use Google/Facebook SDKs.
function SocialLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    // Mock Google user data
    const googleUser = {
      provider: 'google',
      socialId: 'google-mock-id',
      email: 'googleuser@example.com',
      username: 'googleuser',
      avatar: 'https://i.pravatar.cc/150?img=3',
    };
    try {
      const res = await socialLogin(
        googleUser.provider,
        googleUser.socialId,
        googleUser.email,
        googleUser.username,
        googleUser.avatar
      );
      login(res.data.user, res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      navigate('/dashboard');
    } catch {
      setError('Social login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={2}>
      <Typography mb={1} color="text.secondary">or login with</Typography>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleGoogleLogin}
        sx={{ mt: 1, minWidth: 220, fontWeight: 600 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} /> : null}
      >
        Login with Google (Mock)
      </Button>
    </Box>
  );
}

export default SocialLogin;
