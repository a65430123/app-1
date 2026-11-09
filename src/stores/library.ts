/** 收藏、瀏覽紀錄、品管清單勾選（先存本機；日後雲端同步可依 updatedAt 合併） */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorage } from '@/services/storage';
import type { ContentType } from '@/schema';

export interface Ref { type: ContentType; id: string; at: number }
const key = (t: ContentType, id: string) => `${t}:${id}`;

interface LibraryState {
  favorites: Ref[];
  history: Ref[];
  checklists: Record<string, number[]>; // procedureId → 已勾選項目 index
  isFavorite: (t: ContentType, id: string) => boolean;
  toggleFavorite: (t: ContentType, id: string) => void;
  addHistory: (t: ContentType, id: string) => void;
  clearHistory: () => void;
  toggleCheck: (procId: string, i: number) => void;
  resetChecklist: (procId: string) => void;
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],
      checklists: {},
      isFavorite: (t, id) => get().favorites.some((f) => key(f.type, f.id) === key(t, id)),
      toggleFavorite: (t, id) =>
        set((s) =>
          s.favorites.some((f) => key(f.type, f.id) === key(t, id))
            ? { favorites: s.favorites.filter((f) => key(f.type, f.id) !== key(t, id)) }
            : { favorites: [{ type: t, id, at: Date.now() }, ...s.favorites] },
        ),
      addHistory: (t, id) =>
        set((s) => ({ history: [{ type: t, id, at: Date.now() }, ...s.history.filter((h) => key(h.type, h.id) !== key(t, id))].slice(0, 50) })),
      clearHistory: () => set({ history: [] }),
      toggleCheck: (procId, i) =>
        set((s) => {
          const cur = s.checklists[procId] ?? [];
          return { checklists: { ...s.checklists, [procId]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] } };
        }),
      resetChecklist: (procId) => set((s) => ({ checklists: { ...s.checklists, [procId]: [] } })),
    }),
    { name: 'gct-library', storage: createJSONStorage(() => appStorage), version: 1, partialize: (s) => ({ favorites: s.favorites, history: s.history, checklists: s.checklists }) },
  ),
);

/** 進入詳細頁時記錄瀏覽 */
import { useEffect } from 'react';
export function useTrackView(t: ContentType, id?: string) {
  const add = useLibrary((s) => s.addHistory);
  useEffect(() => {
    if (id) add(t, id);
  }, [t, id, add]);
}
