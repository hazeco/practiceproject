import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (value) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    let hasError = false;
    if (!username) {
      setUsernameError('Please enter your username.');
      hasError = true;
    }
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
      await axios.post('/api/auth/register', { username, email, password });
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={4} boxShadow={4} borderRadius={3} className="bg-white" sx={{ mt: 8 }}>
      <Typography variant="h4" mb={2} align="center" fontWeight={700} color="primary.main">
        Register
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError('');
          }}
          error={!!usernameError}
          helperText={usernameError}
          required
          autoFocus
        />
        <TextField
          label="Email *"
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
        <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: 18 }}>
          Register
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
}

export default Register;
