/**
 * 內容載入層。
 * 預設使用打包在 App 內的「內建內容」（/content），
 * 若本機有較新且通過驗證的「遠端更新內容」，則由 applyBundle() 替換。
 *
 * 注意：下方以 `export let` 匯出，屬於 ES module 的 live binding，
 * 替換後其他模組讀到的就是新資料；畫面重繪由 content-update store 的 revision 觸發。
 */
import type { CalculatorMeta, Material, Procedure, Term, Trade, ContentType, AnyEntry, ContentBundle } from '@/schema';
import { schemas } from '@/schema';
import builtinMeta from '../../content/manifest.json';

const load = <T,>(mods: Record<string, unknown>, type: ContentType): T[] =>
  Object.entries(mods).map(([path, data]) => {
    if (import.meta.env.DEV) {
      const r = schemas[type].safeParse(data);
      if (!r.success) console.error(`[內容格式錯誤] ${path}`, r.error.issues);
    }
    return data as T;
  });

export const builtinBundle: ContentBundle = {
  schemaVersion: builtinMeta.schemaVersion,
  contentVersion: builtinMeta.contentVersion,
  minAppVersion: builtinMeta.minAppVersion,
  publishedAt: builtinMeta.publishedAt,
  materialCategories: builtinMeta.materialCategories,
  data: {
    trades: load<Trade>(import.meta.glob('/content/trades/*.json', { eager: true, import: 'default' }), 'trade'),
    procedures: load<Procedure>(import.meta.glob('/content/procedures/*.json', { eager: true, import: 'default' }), 'procedure'),
    materials: load<Material>(import.meta.glob('/content/materials/*.json', { eager: true, import: 'default' }), 'material'),
    terms: load<Term>(import.meta.glob('/content/terms/*.json', { eager: true, import: 'default' }), 'term'),
    calculators: load<CalculatorMeta>(import.meta.glob('/content/calculators/*.json', { eager: true, import: 'default' }), 'calculator'),
  },
};

export let trades: Trade[] = [];
export let procedures: Procedure[] = [];
export let materials: Material[] = [];
export let terms: Term[] = [];
export let calculators: CalculatorMeta[] = [];
/** 材料分類（依內容設定的順序；未列出的依名稱排在後面） */
export let materialCategories: string[] = [];
export let activeContent: { version: string; publishedAt: string; source: 'builtin' | 'remote' } = {
  version: builtinBundle.contentVersion,
  publishedAt: builtinBundle.publishedAt,
  source: 'builtin',
};

const index = <T extends { id: string }>(arr: T[]) => new Map(arr.map((x) => [x.id, x]));
let maps = {
  trade: new Map<string, Trade>(),
  procedure: new Map<string, Procedure>(),
  material: new Map<string, Material>(),
  term: new Map<string, Term>(),
  calculator: new Map<string, CalculatorMeta>(),
};

const listeners = new Set<() => void>();
/** 內容替換時通知（例：搜尋索引需重建） */
export const onContentChange = (fn: () => void) => (listeners.add(fn), () => listeners.delete(fn));

export function applyBundle(b: ContentBundle, source: 'builtin' | 'remote') {
  const published = <T extends { status?: string }>(arr: T[]) => arr.filter((x) => x.status !== 'draft');
  trades = published(b.data.trades).sort((a, c) => a.order - c.order);
  procedures = published(b.data.procedures);
  materials = published(b.data.materials);
  terms = published(b.data.terms).sort((a, c) => a.title.localeCompare(c.title, 'zh-Hant-TW'));
  calculators = published(b.data.calculators);
  const order = b.materialCategories ?? [];
  const extra = [...new Set(materials.map((m) => m.category))].filter((c) => !order.includes(c)).sort((x, y) => x.localeCompare(y, 'zh-Hant-TW'));
  materialCategories = [...order.filter((c) => materials.some((m) => m.category === c)), ...extra];
  maps = { trade: index(trades), procedure: index(procedures), material: index(materials), term: index(terms), calculator: index(calculators) };
  activeContent = { version: b.contentVersion, publishedAt: b.publishedAt, source };
  listeners.forEach((fn) => fn());
}
applyBundle(builtinBundle, 'builtin');

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
