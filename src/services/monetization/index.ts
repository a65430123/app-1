/** 預留：廣告／訂閱（尚未實作） */
export type Plan = 'free' | 'pro';
export interface MonetizationService { currentPlan(): Plan; showAds(): boolean }
export const monetizationService: MonetizationService = {
  currentPlan: () => 'free',
  showAds: () => false,
};
