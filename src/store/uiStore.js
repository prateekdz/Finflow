import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      role: 'admin',
      theme: 'light',
      commandPaletteOpen: false,
      mobileSidebarOpen: false,
      setRole: (role) => set({ role }),
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
    }),
    {
      name: 'finance-dashboard-ui-store',
      partialize: (state) => ({ role: state.role, theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);