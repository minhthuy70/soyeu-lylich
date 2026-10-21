import React, { useState, useEffect } from 'react';
import './SkipNavigation.css';

export default function SkipNavigation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);

    const skipLink = document.getElementById('skip-to-main');
    if (skipLink) {
      skipLink.addEventListener('focus', handleFocus);
      skipLink.addEventListener('blur', handleBlur);
    }

    return () => {
      if (skipLink) {
        skipLink.removeEventListener('focus', handleFocus);
        skipLink.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      id="skip-to-main"
      href="#main-content"
      className="skip-link"
      onClick={handleSkip}
    >
      Skip to main content
    </a>
  );
}
