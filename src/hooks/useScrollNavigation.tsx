import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pages = ['/', '/story', '/adventure', '/treasure'];

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef(0);
  const isNavigating = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating.current) return;
      
      const currentPageIndex = pages.indexOf(location.pathname);
      
      if (e.deltaY > 0 && currentPageIndex < pages.length - 1) {
        // Scrolling down - go to next page
        console.log('Navigating to next page:', pages[currentPageIndex + 1]);
        isNavigating.current = true;
        navigate(pages[currentPageIndex + 1]);
        setTimeout(() => {
          isNavigating.current = false;
        }, 1000);
      } else if (e.deltaY < 0 && currentPageIndex > 0) {
        // Scrolling up - go to previous page
        console.log('Navigating to previous page:', pages[currentPageIndex - 1]);
        isNavigating.current = true;
        navigate(pages[currentPageIndex - 1]);
        setTimeout(() => {
          isNavigating.current = false;
        }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [navigate, location.pathname]);

  return null;
};