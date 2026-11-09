/** 圖示註冊表：內容 JSON 以字串指定 icon，這裡對應到 Lucide 元件 */
import type { LucideIcon } from 'lucide-react';
import {
  Building2, BrickWall, Zap, Wind, Construction, Hammer, PaintRoller, Droplets, Sofa, Trees, ListOrdered, Package, BookA, Calculator, LayoutGrid, CircleHelp,
} from 'lucide-react';
import type { ContentType } from '@/schema';

const map: Record<string, LucideIcon> = {
  building: Building2, brick: BrickWall, zap: Zap, wind: Wind, construction: Construction, hammer: Hammer,
  'paint-roller': PaintRoller, droplets: Droplets, sofa: Sofa, trees: Trees,
};
export const iconFor = (name: string): LucideIcon => map[name] ?? CircleHelp;

export const typeIcon: Record<ContentType, LucideIcon> = {
  procedure: ListOrdered, material: Package, term: BookA, calculator: Calculator, trade: LayoutGrid,
};
