import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorage } from '@/services/storage';

export type ViewMode = 'beginner' | 'master';
export type Theme = 'system' | 'light' | 'dark';
export type FontScale = 'normal' | 'large' | 'xlarge';

interface SettingsState {
  mode: ViewMode;
  theme: Theme;
  fontScale: FontScale;
  setMode: (m: ViewMode) => void;
  toggleMode: () => void;
  setTheme: (t: Theme) => void;
  setFontScale: (f: FontScale) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      mode: 'beginner',
      theme: 'system',
      fontScale: 'normal',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'beginner' ? 'master' : 'beginner' }),
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
    }),
    { name: 'gct-settings', storage: createJSONStorage(() => appStorage), version: 1 },
  ),
);
