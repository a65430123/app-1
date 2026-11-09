/**
 * 全站搜尋（MiniSearch）。
 * 中文以「單字＋雙字詞（bigram）」斷詞；英數字以單字斷詞並支援前綴、模糊比對。
 * 也會搜尋 aliases（台語、日語、注音、俗稱）。
 */
import MiniSearch from 'minisearch';
import { procedures, materials, terms, calculators, trades } from '@/content';
import type { ContentType, ModalText } from '@/schema';

export interface SearchDoc {
  key: string;
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  aliases: string;
  tags: string;
  body: string;
}

const CJK = /[㄀-ㄯ㐀-鿿豈-﫿]/;
const TONES = /[ˇˋˊ˙]/g;

export function tokenize(text: string): string[] {
  const out: string[] = [];
  const clean = text.toLowerCase().replace(TONES, '');
  // 拆成「中文連續段」與「英數字段」
  for (const seg of clean.match(/[㄀-ㄯ㐀-鿿豈-﫿]+|[a-z0-9.À-ɏ̀-ͯā-ſ²³-]+/g) ?? []) {
    if (CJK.test(seg[0])) {
      for (let i = 0; i < seg.length; i++) {
        out.push(seg[i]);
        if (i + 1 < seg.length) out.push(seg.slice(i, i + 2));
      }
    } else {
      out.push(seg);
    }
  }
  return out;
}

/** 查詢時：中文只用 bigram（單字查詢則用單字），所有 token 需同時命中 */
function queryTokens(q: string): string[] {
  const clean = q.toLowerCase().replace(TONES, '');
  const out: string[] = [];
  for (const seg of clean.match(/[㄀-ㄯ㐀-鿿豈-﫿]+|[a-z0-9.À-ɏ̀-ͯā-ſ²³-]+/g) ?? []) {
    if (CJK.test(seg[0])) {
      if (seg.length === 1) out.push(seg);
      else for (let i = 0; i + 1 < seg.length; i++) out.push(seg.slice(i, i + 2));
    } else out.push(seg);
  }
  return out;
}

const mt = (m?: ModalText) => (m ? [m.default, m.beginner, m.master].filter(Boolean).join(' ') : '');

function buildDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const push = (type: ContentType, e: { id: string; title: string; summary: string; aliases?: string[]; tags: string[] }, body: string) =>
    docs.push({ key: `${type}:${e.id}`, id: e.id, type, title: e.title, summary: e.summary, aliases: (e.aliases ?? []).join(' '), tags: e.tags.join(' '), body });

  procedures.forEach((p) =>
    push('procedure', p, [mt(p.overview), ...p.steps.map((s) => `${s.title} ${mt(s.body)}`), ...p.materials.map((m) => m.name), ...p.tools.map((t) => t.name)].join(' ')),
  );
  materials.forEach((m) => push('material', m, [m.category, ...m.uses, ...m.brandTypes, ...m.specs.map((s) => s.value)].join(' ')));
  terms.forEach((t) =>
    push('term', t, [mt(t.definition), t.formalName, t.reading?.zhuyin, t.reading?.tailo, t.reading?.kana, t.reading?.romaji].filter(Boolean).join(' ')),
  );
  calculators.forEach((c) => push('calculator', c, c.formulaDisplay.join(' ')));
  trades.forEach((t) => push('trade', t, mt(t.description)));
  return docs;
}

let ms: MiniSearch<SearchDoc> | null = null;
function index() {
  if (ms) return ms;
  ms = new MiniSearch<SearchDoc>({
    idField: 'key',
    fields: ['title', 'aliases', 'summary', 'tags', 'body'],
    storeFields: ['id', 'type', 'title', 'summary'],
    tokenize,
    searchOptions: {
      boost: { title: 5, aliases: 4, tags: 2, summary: 1.5 },
      tokenize: (s) => s.split(' ').filter(Boolean), // 查詢字串已由 queryTokens 斷好
      combineWith: 'AND',
      prefix: (term) => !CJK.test(term),
      fuzzy: (term) => (CJK.test(term) || term.length < 4 ? false : 0.2),
    },
  });
  ms.addAll(buildDocs());
  return ms;
}

export interface SearchHit { id: string; type: ContentType; title: string; summary: string; score: number }

export function search(q: string): SearchHit[] {
  const tokens = queryTokens(q);
  if (!tokens.length) return [];
  return index()
    .search(tokens.join(' '))
    .map((r) => ({ id: r.id as string, type: r.type as ContentType, title: r.title as string, summary: r.summary as string, score: r.score }));
}
