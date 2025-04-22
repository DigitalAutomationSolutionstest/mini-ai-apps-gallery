// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import AppGallery from './components/AppGallery';
import TalentScanner from './components/apps/TalentScanner';
import ContentMaster from './components/apps/ContentMaster';
import FeedbackInsight from './components/apps/FeedbackInsight';
import DailyHelper from './components/apps/DailyHelper';
import PricingPage from './components/PricingPage';
import CookieConsent from './components/CookieConsent';
import { AppProvider } from './context/AppContext';
import AnalyticsProvider from './components/providers/AnalyticsProvider';

function App() {
  return (
    <AppProvider>
      <Router>
        <AnalyticsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<>
                <Hero />
                <AppGallery />
              </>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gallery" element={<AppGallery />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/app/talent-scanner" element={<TalentScanner />} />
              <Route path="/app/content-master" element={<ContentMaster />} />
              <Route path="/app/feedback-insight" element={<FeedbackInsight />} />
              <Route path="/app/daily-helper" element={<DailyHelper />} />
            </Route>
          </Routes>
          <CookieConsent />
          <Analytics />
        </AnalyticsProvider>
      </Router>
    </AppProvider>
  );
}

export default App;