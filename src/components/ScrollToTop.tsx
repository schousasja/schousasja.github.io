import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there's an anchor hash (e.g. #contact or #newsletter-card), scroll smoothly to that element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Otherwise, scroll immediately to top on route change
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
};
