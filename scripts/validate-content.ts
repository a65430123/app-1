/**
 * 內容驗證：npm run validate:content
 * 檢查 schema、id 重複、檔名與 id 一致、關聯 id 是否存在。任一錯誤即以非 0 結束（建置會失敗）。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { schemas, SCHEMA_VERSION, type ContentType } from '../src/schema/index.ts';

const root = join(import.meta.dirname, '..', 'content');
const dirs: Record<string, ContentType> = {
  trades: 'trade', procedures: 'procedure', materials: 'material', terms: 'term', calculators: 'calculator',
};

const errors: string[] = [];
const ids: Record<ContentType, Set<string>> = { trade: new Set(), procedure: new Set(), material: new Set(), term: new Set(), calculator: new Set() };
const all: { type: ContentType; file: string; data: any }[] = [];

for (const [dir, type] of Object.entries(dirs)) {
  for (const f of readdirSync(join(root, dir)).filter((x) => x.endsWith('.json'))) {
    const file = `${dir}/${f}`;
    let data: any;
    try { data = JSON.parse(readFileSync(join(root, dir, f), 'utf8')); } catch (e) { errors.push(`${file}: JSON 解析失敗 ${e}`); continue; }
    const r = schemas[type].safeParse(data);
    if (!r.success) r.error.issues.forEach((i) => errors.push(`${file}: ${i.path.join('.')} ${i.message}`));
    if (data.id !== basename(f, '.json')) errors.push(`${file}: 檔名須與 id 相同（id=${data.id}）`);
    if (ids[type].has(data.id)) errors.push(`${file}: id 重複 ${data.id}`);
    ids[type].add(data.id);
    all.push({ type, file, data });
  }
}

const ref = (file: string, t: ContentType, list: string[] | undefined) =>
  list?.forEach((x) => { if (!ids[t].has(x)) errors.push(`${file}: 找不到關聯的 ${t}「${x}」`); });

for (const { file, data } of all) {
  ref(file, 'trade', data.tradeIds);
  ref(file, 'procedure', data.relatedProcedureIds);
  ref(file, 'term', data.relatedTermIds);
  ref(file, 'calculator', data.calculatorIds);
  ref(file, 'material', data.materials?.map((m: any) => m.materialId).filter(Boolean));
}

// manifest.json：版本格式
try {
  const m = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
  if (!/^\d{4}\.\d{2}\.\d{2}-\d+$/.test(m.contentVersion)) errors.push('manifest.json: contentVersion 格式須為 YYYY.MM.DD-序號');
  if (m.schemaVersion !== SCHEMA_VERSION) errors.push(`manifest.json: schemaVersion（${m.schemaVersion}）與程式（${SCHEMA_VERSION}）不一致`);
  if (!/^\d+\.\d+\.\d+$/.test(m.minAppVersion)) errors.push('manifest.json: minAppVersion 須為 semver');
  for (const id of m.featuredProcedures ?? []) if (!ids.procedure.has(id)) errors.push(`manifest.json: featuredProcedures 找不到工序「${id}」`);
  const used = new Set(all.filter((x) => x.type === 'material').map((x) => x.data.category));
  for (const c of used) if (!(m.materialCategories ?? []).includes(c)) errors.push(`manifest.json: materialCategories 未列出分類「${c}」（會排在最後）`);
} catch (e) {
  errors.push(`manifest.json: 讀取失敗 ${e}`);
}

if (errors.length) {
  console.error(`✗ 內容驗證失敗（${errors.length}）\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ 內容驗證通過：${all.length} 筆`);
