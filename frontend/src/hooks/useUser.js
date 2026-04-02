import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage changes (from other tabs or pages)
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        if (event.newValue) {
          setUser(JSON.parse(event.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return user;
};
