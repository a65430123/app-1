/**
 * 內容載入層：讀取 /content 下所有 JSON。
 * P5 起會先檢查本機是否有「遠端更新後的內容」，有就優先使用。
 */
import type { CalculatorMeta, Material, Procedure, Term, Trade, ContentType, AnyEntry } from '@/schema';
import { schemas } from '@/schema';

const load = <T,>(mods: Record<string, unknown>, type: ContentType): T[] =>
  Object.entries(mods).map(([path, data]) => {
    if (import.meta.env.DEV) {
      const r = schemas[type].safeParse(data);
      if (!r.success) console.error(`[內容格式錯誤] ${path}`, r.error.issues);
    }
    return data as T;
  });

export const trades = load<Trade>(import.meta.glob('/content/trades/*.json', { eager: true, import: 'default' }), 'trade').sort(
  (a, b) => a.order - b.order,
);
export const procedures = load<Procedure>(import.meta.glob('/content/procedures/*.json', { eager: true, import: 'default' }), 'procedure');
export const materials = load<Material>(import.meta.glob('/content/materials/*.json', { eager: true, import: 'default' }), 'material');
export const terms = load<Term>(import.meta.glob('/content/terms/*.json', { eager: true, import: 'default' }), 'term').sort((a, b) =>
  a.title.localeCompare(b.title, 'zh-Hant-TW'),
);
export const calculators = load<CalculatorMeta>(import.meta.glob('/content/calculators/*.json', { eager: true, import: 'default' }), 'calculator');

const index = <T extends { id: string }>(arr: T[]) => new Map(arr.map((x) => [x.id, x]));
const maps = {
  trade: index(trades),
  procedure: index(procedures),
  material: index(materials),
  term: index(terms),
  calculator: index(calculators),
};

export const getTrade = (id?: string) => (id ? maps.trade.get(id) : undefined);
export const getProcedure = (id?: string) => (id ? maps.procedure.get(id) : undefined);
export const getMaterial = (id?: string) => (id ? maps.material.get(id) : undefined);
export const getTerm = (id?: string) => (id ? maps.term.get(id) : undefined);
export const getCalculator = (id?: string) => (id ? maps.calculator.get(id) : undefined);
export const getEntry = (type: ContentType, id: string): AnyEntry | undefined => maps[type].get(id);

/** 各類型內容的網址 */
export function entryPath(type: ContentType, id: string) {
  switch (type) {
    case 'trade': return `/trades/${id}`;
    case 'procedure': return `/procedures/${id}`;
    case 'material': return `/materials/${id}`;
    case 'term': return `/glossary/${id}`;
    case 'calculator': return `/tools/${id}`;
  }
}

export const typeLabel: Record<ContentType, string> = {
  trade: '工種', procedure: '工序', material: '材料', term: '術語', calculator: '計算機',
};

export const originLabel: Record<Term['origin'], string> = {
  zh: '國語', tw: '台語', ja: '日語外來語', en: '英語', mixed: '混合',
};
