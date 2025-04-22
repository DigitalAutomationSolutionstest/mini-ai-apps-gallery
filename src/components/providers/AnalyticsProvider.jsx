import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as analytics from '../../utils/analytics';

const AnalyticsProvider = ({ children }) => {
  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    analytics.initGA();
  }, []);

  // Track page views
  useEffect(() => {
    analytics.pageview(location.pathname + location.search);
  }, [location]);

  // Create context for analytics throughout the app
  const analyticsContext = {
    trackUserInteraction: analytics.trackUserInteraction,
    trackAppUsage: analytics.trackAppUsage,
    trackError: analytics.trackError,
    event: analytics.event,
  };

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default AnalyticsProvider;