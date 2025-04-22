// CookieConsent.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Link } from '@mui/material';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setOpen(false);
    // Enable analytics after consent
    window.gtag?.('consent', 'update', {
      'analytics_storage': 'granted'
    });
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setOpen(false);
    // Disable analytics after decline
    window.gtag?.('consent', 'update', {
      'analytics_storage': 'denied'
    });
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: '600px',
          width: '90%',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
        }
      }}
    >
      <Box>
        <Box sx={{ mb: 2, color: 'text.primary' }}>
          We use cookies to enhance your experience and analyze our site usage. 
          Please read our{' '}
          <Link href="/privacy" color="primary">
            Privacy Policy
          </Link>
          {' '}for more information.
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleDecline}
            size="small"
          >
            Decline
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAccept}
            size="small"
          >
            Accept
          </Button>
        </Box>
      </Box>
    </Snackbar>
  );
};

export default CookieConsent;