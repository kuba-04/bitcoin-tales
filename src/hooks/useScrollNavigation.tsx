import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pages = ['/', '/story', '/adventure', '/treasure'];
const SCROLL_THRESHOLD = 100; // Amount of scroll needed to trigger navigation

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef(0);
  const isNavigating = useRef(false);
  const accumulatedDelta = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating.current) return;
      
      const currentPageIndex = pages.indexOf(location.pathname);
      
      // Accumulate scroll delta
      accumulatedDelta.current += e.deltaY;

      // Check if accumulated scroll passes threshold
      if (accumulatedDelta.current > SCROLL_THRESHOLD && currentPageIndex < pages.length - 1) {
        // Scrolling down - go to next page
        console.log('Navigating to next page:', pages[currentPageIndex + 1]);
        isNavigating.current = true;
        navigate(pages[currentPageIndex + 1]);
        // Reset accumulated delta
        accumulatedDelta.current = 0;
        setTimeout(() => {
          isNavigating.current = false;
        }, 1000);
      } else if (accumulatedDelta.current < -SCROLL_THRESHOLD && currentPageIndex > 0) {
        // Scrolling up - go to previous page
        console.log('Navigating to previous page:', pages[currentPageIndex - 1]);
        isNavigating.current = true;
        navigate(pages[currentPageIndex - 1]);
        // Reset accumulated delta
        accumulatedDelta.current = 0;
        setTimeout(() => {
          isNavigating.current = false;
        }, 1000);
      }

      // Reset accumulated delta if user changes scroll direction
      if ((e.deltaY > 0 && accumulatedDelta.current < 0) || 
          (e.deltaY < 0 && accumulatedDelta.current > 0)) {
        accumulatedDelta.current = e.deltaY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [navigate, location.pathname]);

  return null;
};