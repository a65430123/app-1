/** 比較版本字串（支援 1.2.3 與 2026.11.09-1 這類格式）：a>b 回傳正數 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(/[^0-9]+/).filter(Boolean).map(Number);
  const pb = b.split(/[^0-9]+/).filter(Boolean).map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

export async function sha256Hex(text: string): Promise<string | null> {
  if (!globalThis.crypto?.subtle) return null; // 非安全環境（http）無法計算 → 呼叫端略過檢查
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
