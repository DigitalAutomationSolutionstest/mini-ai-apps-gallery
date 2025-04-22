import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link, 
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const footerLinks = [
  {
    title: "Products",
    items: [
      { name: "Talent Scanner", path: "/app/talent-scanner" },
      { name: "Content Master", path: "/app/content-master" },
      { name: "Feedback Insight", path: "/app/feedback-insight" },
      { name: "Daily Helper", path: "/app/daily-helper" }
    ]
  },
  {
    title: "Resources",
    items: [
      { name: "Documentation", path: "/docs" },
      { name: "API Reference", path: "/api" },
      { name: "Tutorials", path: "/tutorials" },
      { name: "Blog", path: "/blog" }
    ]
  },
  {
    title: "Company",
    items: [
      { name: "About Us", path: "/about" },
      { name: "Pricing", path: "/pricing" },
      { name: "Careers", path: "/careers" },
      { name: "Contact", path: "/contact" }
    ]
  },
  {
    title: "Legal",
    items: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Data Processing", path: "/data-processing" }
    ]
  }
];

const Footer = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer"
      sx={{ 
        py: 6, 
        backgroundColor: theme.palette.grey[50],
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand and Description */}
          <Grid item xs={12} md={4}>
            <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                component="img"
                src="/assets/images/logo.png"
                alt="Mini AI Apps"
                sx={{ height: 30, width: 30, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'primary.main',
                }}
              >
                MINI AI APPS
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Supercharge your productivity with our collection of specialized AI tools, 
              designed to help you accomplish specific tasks quickly and efficiently.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="inherit" aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="Twitter">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="LinkedIn">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="GitHub">
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="inherit" aria-label="Email">
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Footer Links */}
          {footerLinks.map((category) => (
            <Grid key={category.title} item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" color="text.primary" gutterBottom fontWeight={600}>
                {category.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {category.items.map((item) => (
                  <Box component="li" key={item.name} sx={{ py: 0.5 }}>
                    <Link
                      component={RouterLink}
                      to={item.path}
                      color="text.secondary"
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' },
                        fontSize: '0.875rem'
                      }}
                    >
                      {item.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Mini AI Apps. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.75rem'
              }}
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.75rem'
              }}
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/sitemap"
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                fontSize: '0.75rem'
              }}
            >
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;