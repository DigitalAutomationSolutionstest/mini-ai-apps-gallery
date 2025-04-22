
import React from 'react';
import { Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-[#0d0f11] via-[#101216] to-[#0a0c10] text-gray-400 border-t border-[#1a1c1f] py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Column 1: Logo & Description */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/18e84809-4fcb-47d4-ba47-904265c5dea2.png" 
              alt="Logo" 
              className="w-6 h-6" 
            />
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              Digital Automation Solutions
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-md">
            Soluzioni AI su misura per il tuo business. Dashboard, automazioni e mini-app potenti sempre con te.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex-1">
          <h3 className="text-gray-200 font-medium mb-4">Navigazione</h3>
          <ul className="space-y-2">
            <li>
              <a href="#apps" className="text-sm hover:text-purple-400 hover:shadow-glow transition-all">
                Mini App
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-sm hover:text-purple-400 hover:shadow-glow transition-all">
                Prezzi
              </a>
            </li>
            <li>
              <a href="#coming-soon" className="text-sm hover:text-purple-400 hover:shadow-glow transition-all">
                In arrivo
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="flex-1">
          <h3 className="text-gray-200 font-medium mb-4">Contatti</h3>
          <div className="space-y-2">
            <a 
              href="mailto:info.digitalautomationsolutions@gmail.com"
              className="flex items-center gap-2 text-sm hover:text-purple-400 hover:shadow-glow transition-all"
            >
              <Mail className="w-4 h-4" />
              info.digitalautomationsolutions@gmail.com
            </a>
            <a 
              href="https://github.com/DigitalAutomationSolutionstest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-purple-400 hover:shadow-glow transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub Project
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#1a1c1f] text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Digital Automation Solutions — Powered by OpenAI & Supabase
        </p>
      </div>
    </footer>
  );
};
