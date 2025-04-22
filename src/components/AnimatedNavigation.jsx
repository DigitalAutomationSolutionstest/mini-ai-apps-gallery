import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

// Navigation items for both desktop and mobile
const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Apps Gallery', path: '/gallery' },
  { label: 'Pricing', path: '/pricing' },
];

// Mini AI apps for dropdown menu
const miniApps = [
  { label: 'Talent Scanner', path: '/app/talent-scanner' },
  { label: 'Content Master', path: '/app/content-master' },
  { label: 'Feedback Insight', path: '/app/feedback-insight' },
  { label: 'Daily Helper', path: '/app/daily-helper' },
];

/**
 * Animated Navigation component for the header
 * Includes responsive behavior for mobile and desktop
 * Features animated transitions and dropdown menus
 */
const AnimatedNavigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for dropdown menus
  const [appsMenuAnchor, setAppsMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Handle apps menu open/close
  const handleAppsMenuOpen = (event) => {
    setAppsMenuAnchor(event.currentTarget);
  };
  
  const handleAppsMenuClose = () => {
    setAppsMenuAnchor(null);
  };
  
  // Handle user menu open/close
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  // Check if a path is active
  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };
  
  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };
  
  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (custom) => ({
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: custom * 0.1,
        duration: 0.4
      }
    }),
  };
  
  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, pt: 2, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{ 
                py: 1.5,
                bgcolor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 700 : 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        <ListItem sx={{ pt: 2, pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2 }}>
            Mini AI Apps
          </Typography>
        </ListItem>
        
        {miniApps.map((app) => (
          <ListItem key={app.label} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={app.path}
              onClick={handleDrawerToggle}
              sx={{ 
                py: 1.5,
                bgcolor: isActive(app.path) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                color: isActive(app.path) ? 'primary.main' : 'text.primary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemText 
                primary={app.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(app.path) ? 700 : 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit"
        elevation={0}
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 70 }}>
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              <Box 
                component={RouterLink}
                to="/"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  mr: 3
                }}
              >
                <Box 
                  component="img"
                  src="/assets/images/logo.png"
                  alt="Mini AI Apps"
                  sx={{ height: 34, width: 34, mr: 1 }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: 'primary.main',
                    display: { xs: 'none', md: 'flex' },
                  }}
                >
                  MINI AI APPS
                </Typography>
              </Box>
            </motion.div>

            {/* Mobile menu button */}
            {isMobile ? (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <>
                {/* Desktop navigation items */}
                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      custom={index}
                      variants={navItemVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <Button
                        component={RouterLink}
                        to={item.path}
                        sx={{
                          mx: 1,
                          color: isActive(item.path) ? 'primary.main' : 'text.primary',
                          fontWeight: isActive(item.path) ? 700 : 500,
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: 'primary.main',
                          },
                          '&::after': isActive(item.path) ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 8,
                            right: 8,
                            height: 3,
                            bgcolor: 'primary.main',
                            borderRadius: '3px 3px 0 0',
                          } : {},
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                  
                  {/* Apps dropdown */}
                  <motion.div
                    custom={navItems.length}
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <Button
                      onClick={handleAppsMenuOpen}
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{
                        mx: 1,
                        color: miniApps.some(app => isActive(app.path)) ? 'primary.main' : 'text.primary',
                        fontWeight: miniApps.some(app => isActive(app.path)) ? 700 : 500,
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'primary.main',
                        },
                      }}
                    >
                      AI Apps
                    </Button>
                  </motion.div>
                  
                  <Menu
                    anchorEl={appsMenuAnchor}
                    open={Boolean(appsMenuAnchor)}
                    onClose={handleAppsMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { 
                        mt: 1.5,
                        overflow: 'visible',
                        borderRadius: 2,
                        width: 220,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {miniApps.map((app) => (
                      <MenuItem
                        key={app.label}
                        onClick={handleAppsMenuClose}
                        component={RouterLink}
                        to={app.path}
                        selected={isActive(app.path)}
                        sx={{ 
                          py: 1.5,
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                            }
                          }
                        }}
                      >
                        {app.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* User account button */}
                <motion.div
                  custom={navItems.length + 1}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={handleUserMenuOpen}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ 
                      borderRadius: '50px',
                      borderWidth: 1.5,
                      px: 2,
                    }}
                  >
                    Account
                  </Button>
                  
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { 
                        mt: 1.5,
                        overflow: 'visible',
                        borderRadius: 2,
                        width: 200,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
                      <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                      Sign Out
                    </MenuItem>
                  </Menu>
                </motion.div>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 280,
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedNavigation;