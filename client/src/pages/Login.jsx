import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton, Divider } from '@mui/material';
import SocialLogin from './SocialLogin';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    let hasError = false;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Please enter your password.');
      hasError = true;
    }
    if (hasError) return;
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.user, res.data.accessToken); // use accessToken for JWT
      localStorage.setItem('refreshToken', res.data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={4} boxShadow={4} borderRadius={3} className="bg-white" sx={{ mt: 8 }}>
      <Typography variant="h4" mb={2} align="center" fontWeight={700} color="primary.main">
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          type="text"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          error={!!emailError}
          helperText={emailError}
          autoFocus
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          error={!!passwordError}
          helperText={passwordError}
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: 18 }}
        >
          Login
        </Button>
      </form>
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Link to="/reset-password" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
          Forgot password?
        </Link>
        <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
          Register
        </Link>
      </Box>
      <Divider sx={{ my: 3 }}>or</Divider>
      <SocialLogin />
    </Box>
  );
}

export default Login;
