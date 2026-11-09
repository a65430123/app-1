/**
 * 內容 Schema（Zod）— 所有 /content 下的 JSON 都必須符合。
 * TypeScript 型別由 Zod 推導，程式與驗證腳本共用同一份定義。
 */
import { z } from 'zod';

export const Difficulty = z.enum(['beginner', 'intermediate', 'master']);
export type Difficulty = z.infer<typeof Difficulty>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式須為 YYYY-MM-DD');
const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id 須為 kebab-case');

export const Reference = z.object({ title: z.string(), url: z.string().url().optional(), note: z.string().optional() });

/** 依模式顯示的文字：default 必填；beginner 為新手額外白話；master 為師傅精簡版 */
export const ModalText = z.object({
  default: z.string(),
  beginner: z.string().optional(),
  master: z.string().optional(),
});
export type ModalText = z.infer<typeof ModalText>;

export const MediaRef = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  kind: z.enum(['photo', 'diagram', 'video']),
});

const Spec = z.object({ label: z.string(), value: z.string() });

const base = {
  id,
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version 須為 semver，例 1.0.0'),
  updatedAt: isoDate,
  tags: z.array(z.string()),
  difficulty: Difficulty,
  title: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  summary: z.string(),
  status: z.enum(['draft', 'published']).optional(),
  sources: z.array(Reference).optional(),
};

export const Trade = z.object({
  ...base,
  type: z.literal('trade'),
  icon: z.string(),
  order: z.number(),
  description: ModalText,
});
export type Trade = z.infer<typeof Trade>;

export const ProcedureStep = z.object({
  order: z.number(),
  title: z.string(),
  body: ModalText,
  keyPoints: z.array(z.string()).optional(),
  specs: z.array(Spec).optional(),
  waitTime: z.string().optional(),
  media: z.array(MediaRef).optional(),
});
export type ProcedureStep = z.infer<typeof ProcedureStep>;

export const Procedure = z.object({
  ...base,
  type: z.literal('procedure'),
  tradeIds: z.array(id).min(1),
  overview: ModalText,
  duration: z.string().optional(),
  steps: z.array(ProcedureStep).min(1),
  materials: z.array(z.object({ materialId: id.optional(), name: z.string(), spec: z.string().optional(), qtyNote: z.string().optional() })),
  tools: z.array(z.object({ name: z.string(), note: z.string().optional() })),
  commonMistakes: z.array(z.object({ mistake: z.string(), consequence: z.string(), prevention: z.string() })),
  qcChecklist: z.array(z.object({ item: z.string(), criteria: z.string().optional(), method: z.string().optional() })),
  safety: z.array(z.object({ level: z.enum(['info', 'warning', 'danger']), text: z.string() })),
  relatedTermIds: z.array(id).optional(),
  relatedProcedureIds: z.array(id).optional(),
  calculatorIds: z.array(id).optional(),
});
export type Procedure = z.infer<typeof Procedure>;

export const Material = z.object({
  ...base,
  type: z.literal('material'),
  category: z.string(),
  tradeIds: z.array(id),
  specs: z.array(Spec),
  uses: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  brandTypes: z.array(z.string()),
  priceUnit: z.string(),
  storage: z.array(z.string()),
  cautions: z.array(z.string()),
  media: z.array(MediaRef).optional(),
});
export type Material = z.infer<typeof Material>;

export const TermOrigin = z.enum(['zh', 'tw', 'ja', 'en', 'mixed']);
export type TermOrigin = z.infer<typeof TermOrigin>;

export const Term = z.object({
  ...base,
  type: z.literal('term'),
  origin: TermOrigin,
  reading: z.object({ zhuyin: z.string().optional(), tailo: z.string().optional(), kana: z.string().optional(), romaji: z.string().optional() }).optional(),
  formalName: z.string().optional(),
  definition: ModalText,
  examples: z.array(z.string()).optional(),
  tradeIds: z.array(id).optional(),
  relatedProcedureIds: z.array(id).optional(),
});
export type Term = z.infer<typeof Term>;

export const CalculatorInput = z.object({
  key: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  kind: z.enum(['number', 'select']).default('number'),
  default: z.number().optional(),
  min: z.number().optional(),
  step: z.number().optional(),
  options: z.array(z.object({ value: z.number(), label: z.string() })).optional(),
  help: z.string().optional(),
});
export type CalculatorInput = z.infer<typeof CalculatorInput>;

export const CalculatorMeta = z.object({
  ...base,
  type: z.literal('calculator'),
  engine: z.string(),
  inputs: z.array(CalculatorInput),
  params: z.array(z.object({ key: z.string(), label: z.string(), value: z.number(), unit: z.string().optional(), note: z.string().optional() })),
  formulaDisplay: z.array(z.string()),
  notes: z.array(z.string()),
  relatedProcedureIds: z.array(id).optional(),
});
export type CalculatorMeta = z.infer<typeof CalculatorMeta>;

export type ContentType = 'trade' | 'procedure' | 'material' | 'term' | 'calculator';
export type AnyEntry = Trade | Procedure | Material | Term | CalculatorMeta;

export const schemas = { trade: Trade, procedure: Procedure, material: Material, term: Term, calculator: CalculatorMeta } as const;
