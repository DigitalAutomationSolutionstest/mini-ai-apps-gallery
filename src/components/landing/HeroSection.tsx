
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const HeroSection = () => {
  const scrollToMiniApps = () => {
    const miniAppsSection = document.getElementById('mini-apps');
    if (miniAppsSection) {
      miniAppsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#0d0f11] text-gray-100 overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-20"
      >
        <source src="/assets/videos/mesh-tech.mp4" type="video/mp4" />
      </video>

      {/* Background Overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#101216] to-[#0a0c10] opacity-90" />
      </div>

      {/* Hero Content */}
      <div className="z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-6"
        >
          <img
            src="/lovable-uploads/18e84809-4fcb-47d4-ba47-904265c5dea2.png"
            alt="Mini AI Hub Logo"
            className="w-40 h-40 mx-auto animate-float"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text mb-4"
        >
          Crea la tua Mini App o Sito AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-2 text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Soluzioni su misura per startup, business e creator. Personalizzate. Modulari. Pronte a stupire.
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <button
            onClick={scrollToMiniApps}
            className="px-6 py-3 bg-white hover:bg-purple-50 hover:scale-105 transition-all text-purple-600 font-medium rounded-lg shadow-lg shadow-purple-500/20"
          >
            Scopri le Mini App
          </button>
          <a
            href="#quote"
            className="px-6 py-3 border border-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all text-white rounded-lg font-medium"
          >
            Richiedi Soluzione AI
          </a>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={scrollToMiniApps}
      >
        <ArrowDown className="w-6 h-6 text-white cursor-pointer" />
      </motion.div>
    </section>
  );
};

