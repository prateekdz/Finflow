import { useEffect } from 'react';
import { useFinflowStore } from '../store/useFinflowStore';

export function useTheme() {
  const activeTheme = useFinflowStore((s) => s.activeTheme);
  const setActiveTheme = useFinflowStore((s) => s.setActiveTheme);

  const applyTheme = (theme) => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  // Initialize on mount by checking system preference
  useEffect(() => {
    if (activeTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDark ? 'dark' : 'light');
    } else {
      applyTheme(activeTheme);
    }
  }, [activeTheme]);

  const toggleTheme = () => {
    switch (activeTheme) {
      case 'light':
        setActiveTheme('dark');
        break;
      case 'dark':
        setActiveTheme('system');
        break;
      case 'system':
      default:
        setActiveTheme('light');
        break;
    }
  };

  const isDark =
    activeTheme === 'dark' ||
    (activeTheme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return { theme: activeTheme, isDark, toggleTheme, setTheme: setActiveTheme };
}
