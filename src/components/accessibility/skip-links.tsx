'use client';

import React from 'react';

interface SkipLinksProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' }
  ],
  className = 'skip-links'
}) => {
  return (
    <div className={className}>
      {links.map((link, index) => (
        <a 
          key={index}
          href={link.href} 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded focus:shadow-lg"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};