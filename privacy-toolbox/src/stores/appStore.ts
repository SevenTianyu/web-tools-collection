import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, Theme, FileInfo } from '@types'

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark' as Theme,
      setTheme: (theme) => set({ theme }),
      recentFiles: [],
      addRecentFile: (file) =>
        set((state) => ({
          recentFiles: [file, ...state.recentFiles.slice(0, 9)],
        })),
      clearRecentFiles: () => set({ recentFiles: [] }),
    }),
    {
      name: 'privacy-toolbox-storage',
    }
  )
)
