/**
 * 把 /content 打包成「遠端更新用」的 bundle 與 manifest。
 * - 建置時：由 vite 外掛輸出到 dist/content-api/
 * - 開發時：由 vite 外掛即時提供 /content-api/*（方便測試更新流程）
 * 本檔只用 Node 內建模組，供 vite.config.ts 與腳本共用。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export interface ContentManifest {
  schemaVersion: number;
  contentVersion: string;
  minAppVersion: string;
  publishedAt: string;
  bundle: string; // bundle 檔名（相對 manifest 所在目錄）
  hash: string;   // bundle 內容的 SHA-256（hex）
  size: number;
}

const dirs = ['trades', 'procedures', 'materials', 'terms', 'calculators'] as const;

export function buildContentBundle(root: string) {
  const meta = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
  const data: Record<string, unknown[]> = {};
  for (const d of dirs) {
    data[d] = readdirSync(join(root, d))
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => JSON.parse(readFileSync(join(root, d, f), 'utf8')));
  }
  const bundleObj = {
    schemaVersion: meta.schemaVersion,
    contentVersion: meta.contentVersion,
    minAppVersion: meta.minAppVersion,
    publishedAt: meta.publishedAt,
    materialCategories: meta.materialCategories ?? [],
    featuredProcedures: meta.featuredProcedures ?? [],
    data,
  };
  const bundleText = JSON.stringify(bundleObj);
  const hash = createHash('sha256').update(bundleText, 'utf8').digest('hex');
  const manifest: ContentManifest = {
    schemaVersion: meta.schemaVersion,
    contentVersion: meta.contentVersion,
    minAppVersion: meta.minAppVersion,
    publishedAt: meta.publishedAt,
    bundle: `bundle-${meta.contentVersion}.json`,
    hash,
    size: Buffer.byteLength(bundleText, 'utf8'),
  };
  return { manifest, manifestText: JSON.stringify(manifest, null, 2), bundleText };
}
