import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/user';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Avatar, 
  CircularProgress, 
  InputLabel, 
  styled,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import { PhotoCamera, Person, Edit, Save } from '@mui/icons-material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

const FileUploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  borderRadius: theme.spacing(1),
  border: '2px dashed rgba(25, 118, 210, 0.3)',
  backgroundColor: 'rgba(25, 118, 210, 0.04)',
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    border: '2px dashed rgba(25, 118, 210, 0.6)',
    transform: 'translateY(-1px)',
  },
  '&:focus': {
    border: `2px solid ${theme.palette.primary.main}`,
    outline: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
    },
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
  },
}));

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', avatar: '', bio: '' });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in again');
          setProfile(null);
          setLoading(false);
          return;
        }
        const res = await getProfile(token);
        const data = res.data.profile || res.data;
        setProfile(data);
        setForm({
          fullName: data.fullName || '',
          avatar: data.avatar || '',
          bio: data.bio || '',
        });
        setAvatarPreview('');
      } catch {
        setError('Failed to load profile data');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        setError('Please select image files only');
        e.target.value = ''; // Clear the input
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setError('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const submitForm = { ...form };
      if (avatarPreview) {
        submitForm.avatar = avatarPreview;
      }
      const res = await updateProfile(token, submitForm);
      setMessage('Profile updated successfully');
      const updatedProfile = res.data.profile;
      setProfile(updatedProfile);
      
      // Update form with the latest data from server
      setForm({
        fullName: updatedProfile.fullName || '',
        avatar: updatedProfile.avatar || '',
        bio: updatedProfile.bio || '',
      });
      
      // Clear only the file input and preview (since file is now uploaded)
      setAvatarPreview('');
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box maxWidth={600} mx="auto" mt={4} px={2}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa', py: 4, px: 2 }}>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h3" 
              component="h1"
              fontWeight={700}
              color="primary.main"
              sx={{ 
                mb: 1,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Profile
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your personal information
            </Typography>
          </Box>

          {/* Avatar Section */}
          <AvatarContainer>
            <StyledAvatar 
              src={avatarPreview || profile?.avatar} 
              alt={profile?.fullName || 'Profile'}
            >
              <Person sx={{ fontSize: 60 }} />
            </StyledAvatar>
          </AvatarContainer>

          <Divider sx={{ mb: 3 }} />

          {/* Alerts */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          {message && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Full Name */}
              <StyledTextField
                label="Full Name"
                name="fullName"
                fullWidth
                value={form.fullName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
                }}
                placeholder="Enter your full name"
              />

              {/* Profile Picture Upload */}
              <Box>
                <InputLabel 
                  sx={{ 
                    mb: 1.5, 
                    color: 'text.primary', 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 20 }} />
                  Profile Picture
                </InputLabel>
                <FileUploadButton
                  component="label"
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                >
                  {avatarPreview ? 'Change Profile Picture' : 'Upload Profile Picture'}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </FileUploadButton>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </Typography>
              </Box>

              {/* Bio */}
              <StyledTextField
                label="Bio"
                name="bio"
                fullWidth
                multiline
                rows={4}
                value={form.bio}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Edit sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                }}
                placeholder="Tell us about yourself..."
              />

              {/* Submit Button */}
              <Box sx={{ pt: 2 }}>
                <SaveButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Save />}
                >
                  Save Changes
                </SaveButton>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
}

export default Profile;