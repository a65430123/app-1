/** 預留：雲端同步收藏／紀錄（尚未實作） */
export interface SyncService { push(): Promise<void>; pull(): Promise<void> }
export const syncService: SyncService = {
  push: () => Promise.resolve(),
  pull: () => Promise.resolve(),
};
