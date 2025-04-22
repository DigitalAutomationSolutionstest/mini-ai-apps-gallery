import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExploreIcon from '@mui/icons-material/Explore';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 12, md: 20 },
        pb: { xs: 12, md: 20 },
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 180, 216, 0.15) 0%, rgba(17, 24, 39, 0.05) 70%)',
      }}
    >
      {/* Abstract shapes */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, transition: { delay: 0.5, duration: 1.5 } }}
        sx={{
          position: 'absolute',
          top: '-5%',
          right: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 180, 216, 0.1) 0%, rgba(0, 180, 216, 0) 70%)',
          filter: 'blur(60px)',
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, transition: { delay: 0.8, duration: 1.5 } }}
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '30%',
          height: '50%',
          borderRadius: '40%',
          background: 'radial-gradient(circle, rgba(0, 119, 182, 0.1) 0%, rgba(0, 119, 182, 0) 70%)',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.75rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Supercharge Your Workflow with AI Mini Apps
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ mb: 4, maxWidth: '90%' }}
                >
                  Access cutting-edge AI tools designed to optimize your productivity and transform the way you work.
                </Typography>
              </motion.div>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <motion.div variants={itemVariants}>
                  <Button
                    component={Link}
                    to="/pricing"
                    variant="contained"
                    size="large"
                    endIcon={<RocketLaunchIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
                      boxShadow: '0 10px 20px rgba(0, 119, 182, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #0096c7 0%, #023e8a 100%)',
                        boxShadow: '0 6px 15px rgba(0, 119, 182, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    size="large"
                    endIcon={<ExploreIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(0, 180, 216, 0.05)',
                      },
                    }}
                  >
                    Explore Apps
                  </Button>
                </motion.div>
              </Box>
              
              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 6 }}>
                  <Box sx={{ display: 'flex' }}>
                    {[1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        component="img"
                        src={`/assets/images/avatar-${i}.jpg`}
                        alt={`User ${i}`}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          border: '2px solid white',
                          ml: i === 1 ? 0 : -1.5,
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>1000+</strong> professionals already using our AI tools
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <motion.div
              variants={imageAnimation}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <Box
                component="img"
                src="/assets/images/ai-dashboard-preview.png"
                alt="AI Apps Dashboard Preview"
                sx={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                }}
              />
              
              {/* Floating UI elements for decoration */}
              <Box
                component={motion.div}
                initial={{ y: -10 }}
                animate={{ y: 10 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 2.5,
                }}
                sx={{
                  position: 'absolute',
                  top: '10%',
                  right: '-5%',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  width: '120px',
                  zIndex: 2,
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <Typography variant="body2" fontWeight="bold">AI Analysis</Typography>
                <Box sx={{ mt: 1, height: '4px', borderRadius: 2, background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)' }} />
              </Box>
              
              <Box
                component={motion.div}
                initial={{ y: 10 }}
                animate={{ y: -10 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 3,
                }}
                sx={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '-10%',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  zIndex: 2,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)'
                  }}
                >
                  <RocketLaunchIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Productivity</Typography>
                  <Typography variant="body2" fontWeight="bold">+85%</Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;