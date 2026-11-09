import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, TriangleAlert, RotateCcw } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, Card, Bullets } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { EntryRow } from '@/components/content/EntryRow';
import { getCalculator } from '@/content';
import { engines, type Values } from '@/features/calculators/engines';
import { useTrackView } from '@/stores/library';
import type { CalculatorMeta } from '@/schema';
import NotFound from './NotFound';

export default function CalculatorPage() {
  const { calcId } = useParams();
  const c = getCalculator(calcId);
  useTrackView('calculator', c?.id);
  if (!c) return <NotFound />;
  return <CalculatorView key={c.id} c={c} />;
}

const defaults = (c: CalculatorMeta) => ({
  inputs: Object.fromEntries(c.inputs.map((i) => [i.key, String(i.default ?? '')])),
  params: Object.fromEntries(c.params.map((p) => [p.key, String(p.value)])),
});

function CalculatorView({ c }: { c: CalculatorMeta }) {
  const [inputs, setInputs] = useState<Record<string, string>>(() => defaults(c).inputs);
  const [params, setParams] = useState<Record<string, string>>(() => defaults(c).params);
  const [showFormula, setShowFormula] = useState(false);
  const engine = engines[c.engine];

  const result = useMemo(() => {
    const toNum = (o: Record<string, string>): Values | null => {
      const r: Values = {};
      for (const [k, v] of Object.entries(o)) {
        const n = parseFloat(v);
        if (!Number.isFinite(n) || n < 0) return null;
        r[k] = n;
      }
      return r;
    };
    const i = toNum(inputs);
    const p = toNum(params);
    return i && p && engine ? engine(i, p) : null;
  }, [inputs, params, engine]);

  const reset = () => {
    const d = defaults(c);
    setInputs(d.inputs);
    setParams(d.params);
  };

  return (
    <>
      <TopBar title={c.title} back />
      <Page>
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted">{c.summary}</p>
          <FavoriteButton type="calculator" id={c.id} />
        </div>

        <SectionTitle action={<button type="button" onClick={reset} className="tap flex items-center gap-1 font-bold text-primary-ink"><RotateCcw className="size-5" aria-hidden />預設值</button>}>
          輸入
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.inputs.map((i) => (
            <label key={i.key} className="block min-w-0">
              <span className="mb-1 block font-bold">{i.label}</span>
              {i.kind === 'select' ? (
                <select value={inputs[i.key]} onChange={(e) => setInputs({ ...inputs, [i.key]: e.target.value })}
                  className="h-14 w-full rounded-2xl border-2 border-line bg-surface px-3 text-lg focus:border-primary focus:outline-none">
                  {i.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <span className="flex h-14 items-center rounded-2xl border-2 border-line bg-surface focus-within:border-primary">
                  <input type="number" inputMode="decimal" min={i.min} step={i.step ?? 'any'} value={inputs[i.key]}
                    onChange={(e) => setInputs({ ...inputs, [i.key]: e.target.value })}
                    className="h-full w-0 min-w-0 flex-1 bg-transparent px-4 text-xl font-bold outline-none" />
                  {i.unit && <span className="pr-4 text-muted">{i.unit}</span>}
                </span>
              )}
              {i.help && <span className="mt-1 block text-sm text-muted">{i.help}</span>}
            </label>
          ))}
        </div>

        <SectionTitle>結果</SectionTitle>
        {result ? (
          <Card className="border-2 border-primary">
            <div className="grid grid-cols-2 gap-3">
              {result.results.filter((r) => r.main).map((r) => (
                <div key={r.label}>
                  <div className="text-sm text-muted">{r.label}</div>
                  <div className="text-4xl font-bold text-primary-ink">{r.value}</div>
                  <div className="text-sm">{r.unit}</div>
                </div>
              ))}
            </div>
            {result.results.some((r) => !r.main) && (
              <dl className="mt-3 border-t border-line pt-3 text-sm">
                {result.results.filter((r) => !r.main).map((r) => (
                  <div key={r.label} className="flex justify-between py-0.5"><dt className="text-muted">{r.label}</dt><dd className="font-bold">{r.value} {r.unit}</dd></div>
                ))}
              </dl>
            )}
            {result.warnings?.map((w) => (
              <p key={w} className="mt-3 flex gap-2 rounded-xl bg-danger-bg p-3 text-sm"><TriangleAlert className="size-5 shrink-0 text-danger" aria-hidden />{w}</p>
            ))}
          </Card>
        ) : (
          <Card className="text-muted">請輸入有效的數值（不可為空或負數）</Card>
        )}

        <button type="button" onClick={() => setShowFormula(!showFormula)} aria-expanded={showFormula}
          className="tap mt-4 flex w-full items-center justify-between rounded-2xl bg-surface-2 px-4 text-lg font-bold">
          {showFormula ? '隱藏公式' : '顯示公式與計算過程'}
          <ChevronDown className={`size-6 transition-transform ${showFormula ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        {showFormula && (
          <div className="mt-3 flex flex-col gap-3">
            <Card>
              <h3 className="mb-2 font-bold">公式</h3>
              <ol className="flex list-decimal flex-col gap-1 pl-6">{c.formulaDisplay.map((f) => <li key={f}>{f}</li>)}</ol>
            </Card>
            {result && (
              <Card>
                <h3 className="mb-2 font-bold">代入計算</h3>
                <ol className="flex flex-col gap-1 font-mono text-[0.9rem]">{result.steps.map((s) => <li key={s} className="break-all">{s}</li>)}</ol>
              </Card>
            )}
            {c.params.length > 0 && (
              <Card>
                <h3 className="mb-2 font-bold">可調係數</h3>
                <div className="flex flex-col gap-3">
                  {c.params.map((p) => (
                    <label key={p.key} className="block">
                      <span className="block">{p.label}{p.unit && <span className="text-muted">（{p.unit}）</span>}</span>
                      <input type="number" inputMode="decimal" step="any" value={params[p.key]}
                        onChange={(e) => setParams({ ...params, [p.key]: e.target.value })}
                        className="mt-1 h-12 w-full rounded-xl border-2 border-line bg-surface px-3 text-lg focus:border-primary focus:outline-none" />
                      {p.note && <span className="text-sm text-muted">{p.note}</span>}
                    </label>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        <SectionTitle>注意</SectionTitle>
        <Card><Bullets items={c.notes} /></Card>
        {c.relatedProcedureIds && (
          <>
            <SectionTitle>相關工序</SectionTitle>
            <div className="flex flex-col gap-2">{c.relatedProcedureIds.map((p) => <EntryRow key={p} type="procedure" id={p} showType={false} />)}</div>
          </>
        )}
        <Disclaimer className="mt-6" />
      </Page>
    </>
  );
}
