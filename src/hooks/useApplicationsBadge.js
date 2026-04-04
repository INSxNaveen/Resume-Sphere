import { useState, useEffect, useRef } from 'react';
import { getApplications } from '../services/api';

/**
 * Custom hook to calculate the unread count of job applications.
 * Compares current total to `rs_lastSeenCount` in localStorage.
 * @returns {number} - The unread count
 */
export function useApplicationsBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    let cancelled = false;

    async function check() {
      try {
        const apps = await getApplications();
        if (cancelled) return;
        
        const lastSeen = parseInt(localStorage.getItem('rs_lastSeenCount') || '0', 10);
        // If lastSeen doesn't exist, we assume 0 or apps.length?
        // User request says: Math.max(0, apps.length - lastSeen)
        const count = Math.max(0, apps.length - lastSeen);
        setUnreadCount(count);
      } catch (err) {
        // Silently fail to avoid breaking UI — badge just won't show
        console.warn('[Resume-Sphere] Badge fetch failed:', err.message);
      }
    }

    check();
    
    // Also listen for potential storage events from other tabs
    const handleStorage = (e) => {
      if (e.key === 'rs_lastSeenCount') {
        check();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => { 
      cancelled = true; 
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return unreadCount;
}
