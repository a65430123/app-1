/**
 * 計算引擎（純函式，可單元測試）。
 * 輸入值、可調係數由 /content/calculators/*.json 定義；這裡只負責計算與「代入過程」。
 */
export type Values = Record<string, number>;
export interface CalcResult {
  results: { label: string; value: string; unit: string; main?: boolean }[];
  steps: string[]; // 代入數值後的計算過程
  warnings?: string[];
}
export type Engine = (input: Values, params: Values) => CalcResult;

const f = (n: number, d = 2) => (Number.isFinite(n) ? Number(n.toFixed(d)).toLocaleString('zh-TW') : '—');

const mortar: Engine = ({ area, thickness, sandRatio: n, waste }, { dryFactor, cementDensity, bagWeight }) => {
  const V = area * (thickness / 100) * (1 + waste / 100);
  const Vd = V * dryFactor;
  const cementV = Vd / (1 + n);
  const sandV = (Vd * n) / (1 + n);
  const kg = cementV * cementDensity;
  const bags = Math.ceil(kg / bagWeight);
  return {
    results: [
      { label: '水泥', value: f(bags, 0), unit: `包（${bagWeight} kg）`, main: true },
      { label: '砂', value: f(sandV), unit: 'm³', main: true },
      { label: '砂漿體積', value: f(V, 3), unit: 'm³' },
      { label: '水泥重量', value: f(kg, 0), unit: 'kg' },
    ],
    steps: [
      `V = ${area} × ${thickness} ÷ 100 × (1 + ${waste}%) = ${f(V, 3)} m³`,
      `Vd = ${f(V, 3)} × ${dryFactor} = ${f(Vd, 3)} m³`,
      `水泥體積 = ${f(Vd, 3)} ÷ (1 + ${n}) = ${f(cementV, 3)} m³`,
      `砂體積 = ${f(Vd, 3)} × ${n} ÷ (1 + ${n}) = ${f(sandV, 3)} m³`,
      `水泥 = ${f(cementV, 3)} × ${cementDensity} = ${f(kg, 0)} kg ÷ ${bagWeight} ≈ ${bags} 包（進位）`,
    ],
  };
};

const tile: Engine = ({ area, w, h, joint, waste, perBox }) => {
  const a = ((w + joint / 10) / 100) * ((h + joint / 10) / 100);
  const pcs = Math.ceil((area / a) * (1 + waste / 100));
  const boxes = perBox > 0 ? Math.ceil(pcs / perBox) : NaN;
  return {
    results: [
      { label: '磁磚', value: f(pcs, 0), unit: '片', main: true },
      ...(perBox > 0 ? [{ label: '約', value: f(boxes, 0), unit: `箱（每箱 ${perBox} 片）`, main: true }] : []),
      { label: '單片含縫面積', value: f(a, 4), unit: 'm²' },
    ],
    steps: [
      `a = (${w} + ${joint / 10}) × (${h} + ${joint / 10}) cm = ${f(a, 4)} m²`,
      `片數 = ${area} ÷ ${f(a, 4)} × (1 + ${waste}%) = ${f((area / a) * (1 + waste / 100))} → ${pcs} 片`,
      ...(perBox > 0 ? [`箱數 = ${pcs} ÷ ${perBox} → ${boxes} 箱`] : []),
    ],
  };
};

const paint: Engine = ({ area, coats, coverage, waste }, { gallon }) => {
  const L = (area * coats) / coverage * (1 + waste / 100);
  const gal = L / gallon;
  return {
    results: [
      { label: '油漆', value: f(L, 1), unit: '公升', main: true },
      { label: '約', value: f(gal, 1), unit: '加侖', main: true },
    ],
    steps: [
      `L = ${area} × ${coats} ÷ ${coverage} × (1 + ${waste}%) = ${f(L, 2)} L`,
      `加侖 = ${f(L, 2)} ÷ ${gallon} = ${f(gal, 2)} gal`,
    ],
  };
};

const voltageDrop: Engine = ({ current, length, voltage, area }, { rho, limit }) => {
  const R = (rho * length) / area;
  const Vd = 2 * current * R;
  const pct = (Vd / voltage) * 100;
  const ok = pct <= limit;
  return {
    results: [
      { label: '壓降', value: f(Vd, 2), unit: 'V', main: true },
      { label: '壓降率', value: f(pct, 2), unit: '%', main: true },
      { label: '單程電阻', value: f(R, 4), unit: 'Ω' },
      { label: '末端電壓', value: f(voltage - Vd, 1), unit: 'V' },
    ],
    steps: [
      `R = ${rho} × ${length} ÷ ${area} = ${f(R, 4)} Ω`,
      `Vd = 2 × ${current} × ${f(R, 4)} = ${f(Vd, 2)} V`,
      `壓降率 = ${f(Vd, 2)} ÷ ${voltage} × 100% = ${f(pct, 2)} %`,
    ],
    warnings: ok ? [] : [`壓降率超過參考上限 ${limit}%，建議加大線徑或縮短距離，並請專業技師確認。`],
  };
};

const concrete: Engine = ({ length, width, thickness, count, waste }) => {
  const V = length * width * (thickness / 100) * count * (1 + waste / 100);
  return {
    results: [
      { label: '混凝土', value: f(V, 2), unit: 'm³', main: true },
      { label: '叫料建議（0.5 進位）', value: f(Math.ceil(V * 2) / 2, 1), unit: 'm³' },
    ],
    steps: [`V = ${length} × ${width} × ${thickness} ÷ 100 × ${count} × (1 + ${waste}%) = ${f(V, 3)} m³`],
  };
};

export const engines: Record<string, Engine> = { mortar, tile, paint, voltageDrop, concrete };
