
import React from 'react';

export const FooterTriangle = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <svg
        className="w-full h-24"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          fill="url(#footerGradient)"
          points="0,100 100,0 100,100"
        />
        <defs>
          <linearGradient id="footerGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6a00f4" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default FooterTriangle;
