import React from 'react';
import { 
  Container, Typography, Box, Card, CardContent, 
  Button, Grid, Chip, Divider, List, ListItem, 
  ListItemIcon, ListItemText, useTheme 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TokenIcon from '@mui/icons-material/Token';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const planFeatureIcons = {
  "Basic access": <TokenIcon fontSize="small" />,
  "tokens": <TokenIcon fontSize="small" />,
  "Standard processing": <AutoGraphIcon fontSize="small" />,
  "Faster processing": <AutoGraphIcon fontSize="small" />,
  "Priority processing": <AutoGraphIcon fontSize="small" />,
  "Highest priority": <AutoGraphIcon fontSize="small" />,
  "Email support": <SupportAgentIcon fontSize="small" />,
  "Priority email": <SupportAgentIcon fontSize="small" />,
  "Dedicated support": <SupportAgentIcon fontSize="small" />,
  "API access": <RocketLaunchIcon fontSize="small" />,
};

// Function to get icon based on feature text
const getFeatureIcon = (text) => {
  for (const [key, icon] of Object.entries(planFeatureIcons)) {
    if (text.includes(key)) {
      return icon;
    }
  }
  return <CheckCircleIcon fontSize="small" />;
};

const PricingPage = () => {
  const { user, subscription, SUBSCRIPTION_PLANS, upgradeSubscription } = useAppContext();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleUpgrade = (planId) => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    
    const checkoutPath = upgradeSubscription(planId);
    navigate(checkoutPath);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <Container maxWidth="xl" className="py-16">
      <Box textAlign="center" mb={10}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="800" 
            sx={{ 
              background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Choose Your Plan
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Typography variant="h5" color="text.secondary" mb={2} maxWidth="700px" mx="auto">
            Select the perfect plan that fits your needs
          </Typography>
          
          <Box 
            sx={{ 
              display: 'inline-flex', 
              backgroundColor: 'rgba(0, 180, 216, 0.1)', 
              borderRadius: 5, 
              p: 1, 
              mb: 5 
            }}
          >
            <Chip
              label="Plans billed monthly"
              color="primary"
              icon={<TokenIcon />}
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        </motion.div>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => {
          const isCurrentPlan = subscription && subscription.id === plan.id;
          const isPro = plan.id === SUBSCRIPTION_PLANS.PRO.id;
          
          return (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
              >
                <Card 
                  raised={isPro}
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    border: isPro ? `2px solid ${theme.palette.primary.main}` : 'none',
                    boxShadow: isPro ? '0 10px 40px rgba(0, 119, 182, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isPro && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: -15,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Chip
                        label="Most Popular"
                        color="primary"
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          background: 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)',
                        }}
                      />
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    
                    <Box display="flex" alignItems="baseline" mb={3}>
                      <Typography 
                        variant="h3" 
                        component="span" 
                        fontWeight="800"
                        sx={{ 
                          color: isPro ? 'primary.main' : 'text.primary'
                        }}
                      >
                        ${plan.price}
                      </Typography>
                      {plan.price > 0 && (
                        <Typography variant="subtitle1" component="span" ml={1} color="text.secondary">
                          /month
                        </Typography>
                      )}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box mb={4} minHeight="220px">
                      <List dense>
                        {plan.features.map((feature, idx) => (
                          <ListItem key={idx} disableGutters>
                            <ListItemIcon sx={{ minWidth: 36, color: isPro ? 'primary.main' : 'success.main' }}>
                              {getFeatureIcon(feature)}
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Button
                      variant={isCurrentPlan ? "outlined" : "contained"}
                      fullWidth
                      size="large"
                      disabled={isCurrentPlan}
                      onClick={() => handleUpgrade(plan.id)}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        background: isPro && !isCurrentPlan ? 'linear-gradient(90deg, #00b4d8 0%, #0077b6 100%)' : undefined,
                        '&:hover': {
                          background: isPro && !isCurrentPlan ? 'linear-gradient(90deg, #0096c7 0%, #023e8a 100%)' : undefined,
                        }
                      }}
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
      
      <Box mt={12} textAlign="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={4} mt={2} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={{ borderRadius: 3, mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  What are tokens?
                </Typography>
                <Typography variant="body2">
                  Tokens are our virtual currency used to access AI features. Each AI request costs a specific number of tokens depending on complexity and processing required.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={{ borderRadius: 3, mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Can I upgrade or downgrade?
                </Typography>
                <Typography variant="body2">
                  Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply in your next billing cycle.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={{ borderRadius: 3, mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  What payment methods do you accept?
                </Typography>
                <Typography variant="body2">
                  We accept all major credit cards (Visa, MasterCard, American Express, Discover) as well as PayPal payments through our secure payment processor, Stripe.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PricingPage;