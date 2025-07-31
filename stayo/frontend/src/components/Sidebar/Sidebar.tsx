
import React, { useState } from 'react';
import { Box, Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from '../Register/LoginForm';
import RegistrationForm from '../Register/RegistrationForm';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const [showLogin, setShowLogin] = useState(true);

  // Reset to login view whenever sidebar is closed
  React.useEffect(() => {
    if (!open) {
      setShowLogin(true);
    }
  }, [open]);


  const handleDrawerClose = () => {
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      onClose={handleDrawerClose}
    >
      <Box
        sx={{
          width: 480,
          maxWidth: '100vw',
          minHeight: '100vh',
          p: 3,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>Welcome</Typography>
        {showLogin ? (
          <Box
            sx={{
              background: '#f8fbff',
              borderRadius: 3,
              boxShadow: '0 2px 16px 0 #e0e7ef',
              p: 3,
              mb: 2,
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#00B0FF', mb: 2 }}>
              Sign In
            </Typography>
            <LoginForm onLoginSuccess={onClose} />
            <Box sx={{ my: 2 }} />
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <span
                style={{ color: '#00B0FF', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setShowLogin(false)}
              >
                Register
              </span>
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              background: '#f8fbff',
              borderRadius: 3,
              boxShadow: '0 2px 16px 0 #e0e7ef',
              p: 3,
              mb: 2,
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#00B0FF', mb: 2 }}>
              Register
            </Typography>
            <RegistrationForm onRegisterSuccess={() => setShowLogin(true)} />
            <Box sx={{ my: 2 }} />
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <span
                style={{ color: '#00B0FF', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setShowLogin(true)}
              >
                Sign In
              </span>
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
