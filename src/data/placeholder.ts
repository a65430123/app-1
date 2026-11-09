/**
 * ⚠ P1 暫用的假資料，只為了讓頁面能點擊預覽。
 * P2 會整個移除，改由 /content 內的 JSON（含 schema 驗證）提供。
 */
import type { LucideIcon } from 'lucide-react';
import {
  Building2, BrickWall, Zap, Wind, Construction, Hammer, PaintRoller, Droplets, Sofa, Trees,
} from 'lucide-react';

export interface PlaceholderTrade { id: string; name: string; icon: LucideIcon; blurb: string }

export const trades: PlaceholderTrade[] = [
  { id: 'structure', name: '土木結構', icon: Building2, blurb: '模板、鋼筋、混凝土' },
  { id: 'masonry', name: '泥作', icon: BrickWall, blurb: '砌磚、粉刷、磁磚' },
  { id: 'electrical-plumbing', name: '水電', icon: Zap, blurb: '給排水、配電、弱電' },
  { id: 'hvac', name: '空調', icon: Wind, blurb: '冷媒管、排水、風管' },
  { id: 'steel', name: '鋼構', icon: Construction, blurb: '鋼骨、焊接、鎖固' },
  { id: 'carpentry', name: '木作', icon: Hammer, blurb: '天花板、隔間、櫃體' },
  { id: 'painting', name: '油漆', icon: PaintRoller, blurb: '批土、底漆、面漆' },
  { id: 'waterproofing', name: '防水', icon: Droplets, blurb: '屋頂、浴室、外牆' },
  { id: 'interior', name: '裝修', icon: Sofa, blurb: '統包、收邊、軟裝' },
  { id: 'landscape', name: '景觀', icon: Trees, blurb: '植栽、鋪面、排水' },
];

export type Difficulty = 'beginner' | 'intermediate' | 'master';

export const procedures: { id: string; title: string; tradeId: string; difficulty: Difficulty; summary: string }[] = [
  { id: 'plastering-finish', title: '粉光', tradeId: 'masonry', difficulty: 'intermediate', summary: '水泥砂漿打底後的表面修飾' },
  { id: 'tile-laying', title: '磁磚鋪貼', tradeId: 'masonry', difficulty: 'intermediate', summary: '軟底／硬底／騎馬釘等工法' },
  { id: 'waterproof-coating', title: '防水塗佈', tradeId: 'waterproofing', difficulty: 'beginner', summary: '浴室、陽台常見防水層施作' },
  { id: 'outlet-wiring', title: '插座配線', tradeId: 'electrical-plumbing', difficulty: 'master', summary: '迴路規劃、線徑選擇與接線' },
];

export const calculators = [
  { id: 'mortar', title: '水泥砂漿用量', desc: '依面積、厚度、配比估算水泥與砂' },
  { id: 'tile', title: '磁磚片數', desc: '依面積、磁磚尺寸與損耗率' },
  { id: 'paint', title: '油漆用量', desc: '依面積、塗刷次數與塗佈率' },
  { id: 'voltage-drop', title: '電線線徑／壓降', desc: '依電流、距離檢核壓降' },
  { id: 'concrete', title: '混凝土方數', desc: '依長寬厚計算立方米' },
];
