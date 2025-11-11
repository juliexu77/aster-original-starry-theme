import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * DuskModeManager - Automatically switches to dusk theme during overnight hours
 * Dusk mode activates between 7 PM and 7 AM to provide a soothing nighttime experience
 */
export function DuskModeManager() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkDuskMode = () => {
      const currentHour = new Date().getHours();
      const isDuskTime = currentHour >= 19 || currentHour < 7; // 7 PM to 7 AM
      
      // Only auto-switch if not manually overridden recently
      const lastManualChange = localStorage.getItem('theme-manual-override');
      const now = Date.now();
      
      // If there was a manual change less than 1 hour ago, don't auto-switch
      if (lastManualChange && now - parseInt(lastManualChange) < 3600000) {
        return;
      }

      if (isDuskTime && theme !== 'dusk') {
        setTheme('dusk');
      } else if (!isDuskTime && theme === 'dusk') {
        // Switch back to light during day
        setTheme('light');
      }
    };

    // Check immediately on mount
    checkDuskMode();

    // Check every minute for theme changes
    const interval = setInterval(checkDuskMode, 60000);

    return () => clearInterval(interval);
  }, [theme, setTheme]);

  return null;
}
