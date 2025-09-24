import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/api/auth/reset-password', { email });
      setMessage('Please check your email (mock): ' + res.data.token);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { token, newPassword });
      setMessage('Password reset successful!');
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={4} boxShadow={4} borderRadius={3} className="bg-white" sx={{ mt: 8 }}>
      <Typography variant="h4" mb={2} align="center" fontWeight={700} color="primary.main">
        Reset Password
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {step === 1 ? (
        <form onSubmit={handleRequest}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: 18 }}>
            Request Password Reset
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset}>
          <TextField label="Token" fullWidth margin="normal" value={token} onChange={e => setToken(e.target.value)} required />
          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: 18 }}>
            Confirm New Password
          </Button>
        </form>
      )}
    </Box>
  );
}

export default ResetPassword;
