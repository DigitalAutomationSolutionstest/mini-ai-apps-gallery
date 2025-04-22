import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nuvvezmucfeaswkmerbs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dnZlem11Y2ZlYXN3a21lcmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDE1NjgsImV4cCI6MjA1OTcxNzU2OH0.UZ26z9EUhlSt9nZRm5aCJGsb_zVhWo_-8VHaK4Xpjj8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create the context
const AppContext = createContext();

// Define subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    tokens: 5,
    features: [
      'Basic access to all mini apps',
      '5 tokens to try each app',
      'Standard processing speed'
    ]
  },
  BASIC: {
    id: 'price_basic',
    name: 'Basic',
    price: 9.99,
    tokens: 100,
    features: [
      'Full access to all mini apps',
      '100 tokens per month',
      'Email support',
      'Faster processing speed'
    ]
  },
  ADVANCED: {
    id: 'price_advanced',
    name: 'Advanced',
    price: 19.99,
    tokens: 500,
    features: [
      'Full access to all mini apps',
      '500 tokens per month',
      'Priority processing',
      'Advanced features unlock',
      'Priority email support'
    ]
  },
  PRO: {
    id: 'price_pro',
    name: 'Pro',
    price: 39.99,
    tokens: -1, // -1 indicates unlimited
    features: [
      'Unlimited tokens',
      'Highest priority processing',
      'All premium features',
      'API access for custom integration',
      'Dedicated support'
    ]
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [tokenCount, setTokenCount] = useState(SUBSCRIPTION_PLANS.FREE.tokens);
  
  // Get current subscription and token count on auth state change
  useEffect(() => {
    // Auth state listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);

        if (currentSession?.user) {
          fetchUserSubscription(currentSession.user.id);
        } else {
          // Reset to free plan for non-authenticated users
          setSubscription(SUBSCRIPTION_PLANS.FREE);
          setTokenCount(SUBSCRIPTION_PLANS.FREE.tokens);
        }
      }
    );

    // Initial auth state
    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        fetchUserSubscription(initialSession.user.id);
      } else {
        setSubscription(SUBSCRIPTION_PLANS.FREE);
        setTokenCount(SUBSCRIPTION_PLANS.FREE.tokens);
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  // Fetch user subscription data from Supabase
  const fetchUserSubscription = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching subscription:", error);
        setSubscription(SUBSCRIPTION_PLANS.FREE);
        setTokenCount(SUBSCRIPTION_PLANS.FREE.tokens);
        return;
      }

      if (!data) {
        // No subscription record, set as free
        setSubscription(SUBSCRIPTION_PLANS.FREE);
        setTokenCount(SUBSCRIPTION_PLANS.FREE.tokens);
        return;
      }

      // Determine subscription plan
      let plan;
      switch (data.plan_id) {
        case SUBSCRIPTION_PLANS.BASIC.id:
          plan = SUBSCRIPTION_PLANS.BASIC;
          break;
        case SUBSCRIPTION_PLANS.ADVANCED.id:
          plan = SUBSCRIPTION_PLANS.ADVANCED;
          break;
        case SUBSCRIPTION_PLANS.PRO.id:
          plan = SUBSCRIPTION_PLANS.PRO;
          break;
        default:
          plan = SUBSCRIPTION_PLANS.FREE;
      }

      setSubscription(plan);
      
      // If Pro plan, set unlimited tokens
      if (plan.id === SUBSCRIPTION_PLANS.PRO.id) {
        setTokenCount(-1); // Unlimited
      } else {
        setTokenCount(data.tokens_remaining || plan.tokens);
      }
    } catch (error) {
      console.error("Error processing subscription data:", error);
      setSubscription(SUBSCRIPTION_PLANS.FREE);
      setTokenCount(SUBSCRIPTION_PLANS.FREE.tokens);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Use a token (decrement token count)
  const useToken = async () => {
    // If unlimited tokens (Pro plan) or free tier, no need to update the database
    if (tokenCount === -1) {
      return true; // Unlimited tokens
    }

    if (tokenCount <= 0) {
      return false; // No tokens left
    }

    // Update token count in state
    const newTokenCount = tokenCount - 1;
    setTokenCount(newTokenCount);

    // If user is authenticated, update token count in database
    if (user) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .update({ tokens_remaining: newTokenCount })
          .eq('user_id', user.id);

        if (error) {
          console.error("Error updating tokens:", error);
          return false;
        }
      } catch (error) {
        console.error("Error processing token update:", error);
        return false;
      }
    }

    return true;
  };

  // Navigate to checkout for subscription upgrade
  const upgradeSubscription = (planId) => {
    // In a production app, this would create a Stripe checkout session
    // and redirect the user to the Stripe checkout page
    
    if (!user) {
      // Redirect to login if not authenticated
      return '/login?redirect=pricing';
    }
    
    return `/checkout?plan=${planId}`;
  };

  const contextValue = {
    user,
    session,
    loading,
    subscription,
    tokenCount,
    signIn,
    signUp,
    signOut,
    useToken,
    upgradeSubscription,
    SUBSCRIPTION_PLANS
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};