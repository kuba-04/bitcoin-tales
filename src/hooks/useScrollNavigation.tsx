import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pages = ['/', '/story', '/adventure', '/treasure'];

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentPageIndex = pages.indexOf(location.pathname);
      
      // Handle arrow key navigation
      if (e.key === 'ArrowRight' && currentPageIndex < pages.length - 1) {
        navigate(pages[currentPageIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        navigate(pages[currentPageIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, location.pathname]);

  return null;
};