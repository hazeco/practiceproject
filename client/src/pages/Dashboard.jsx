import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/user';
import { Box, Typography, CircularProgress, Alert, Avatar, Paper } from '@mui/material';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in again');
          setProfile(null);
          return;
        }
        const res = await getProfile(token);
        setProfile(res.data.profile || res.data);
      } catch {
        setError('Unable to load user data');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return null;

  return (
    <Paper elevation={4} sx={{ maxWidth: 500, mx: 'auto', p: 4, mt: 8, borderRadius: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar src={profile?.avatar} sx={{ width: 80, height: 80, mb: 2 }} />
        <Typography variant="h4" mb={1} fontWeight={700} color="primary.main">Dashboard</Typography>
        <Typography variant="h6">{profile?.username || profile?.fullName}</Typography>
        <Typography color="text.secondary">{profile?.email}</Typography>
        <Typography color="text.secondary" mt={1}>
          {profile?.bio}
        </Typography>
        {profile?.createdAt && (
          <Typography color="text.secondary" mt={2} fontSize={14}>
            Created at: {new Date(profile.createdAt).toLocaleString()}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default Dashboard;
