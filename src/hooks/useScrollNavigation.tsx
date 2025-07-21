import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pages = ['/', '/story', '/adventure', '/treasure'];

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Only handle significant scroll movements
      if (Math.abs(scrollDelta) < 50 || isNavigatingRef.current) {
        lastScrollY = currentScrollY;
        return;
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a timeout to handle navigation after scroll stops
      scrollTimeoutRef.current = setTimeout(() => {
        const currentPageIndex = pages.indexOf(location.pathname);
        
        if (scrollDelta > 0 && currentPageIndex < pages.length - 1) {
          // Scrolling down - go to next page
          isNavigatingRef.current = true;
          navigate(pages[currentPageIndex + 1]);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1000);
        } else if (scrollDelta < 0 && currentPageIndex > 0) {
          // Scrolling up - go to previous page
          isNavigatingRef.current = true;
          navigate(pages[currentPageIndex - 1]);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1000);
        }
        
        lastScrollY = currentScrollY;
      }, 300); // Wait 300ms after scroll stops
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestTick);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [navigate, location.pathname]);

  return null;
};