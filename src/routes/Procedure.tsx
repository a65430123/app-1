import { Link, useParams } from 'react-router-dom';
import { Clock, Info, OctagonAlert, TriangleAlert, CircleCheck, Calculator, RotateCcw } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { SectionTitle, Card } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ModalTextView } from '@/components/content/ModalTextView';
import { TermChips } from '@/components/content/TermSheet';
import { EntryRow } from '@/components/content/EntryRow';
import { getProcedure, getTrade, getCalculator } from '@/content';
import { useSettings } from '@/stores/settings';
import { useLibrary, useTrackView } from '@/stores/library';
import NotFound from './NotFound';

const sections = [
  { id: 'overview', label: '概要' },
  { id: 'steps', label: '步驟' },
  { id: 'materials', label: '材料工具' },
  { id: 'qc', label: '品管' },
  { id: 'safety', label: '安全' },
];

const safetyStyle = {
  danger: { icon: OctagonAlert, cls: 'border-danger bg-danger-bg', ic: 'text-danger', label: '危險' },
  warning: { icon: TriangleAlert, cls: 'border-warning bg-warning-bg', ic: 'text-warning', label: '注意' },
  info: { icon: Info, cls: 'border-line bg-surface', ic: 'text-muted', label: '提醒' },
};

export default function Procedure() {
  const { id } = useParams();
  const p = getProcedure(id);
  const master = useSettings((s) => s.mode) === 'master';
  const checked = useLibrary((s) => (id ? s.checklists[id] : undefined)) ?? [];
  const toggleCheck = useLibrary((s) => s.toggleCheck);
  const resetChecklist = useLibrary((s) => s.resetChecklist);
  useTrackView('procedure', p?.id);
  if (!p) return <NotFound />;

  return (
    <>
      <TopBar title={p.title} back />
      <nav aria-label="段落" className="sticky top-16 z-10 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 py-1">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="flex min-h-12 shrink-0 items-center rounded-full px-4 font-bold text-muted active:bg-surface-2">{s.label}</a>
          ))}
        </div>
      </nav>
      <Page>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap gap-2 text-sm">
              {p.tradeIds.map((t) => (
                <Link key={t} to={`/trades/${t}`} className="rounded-full bg-surface-2 px-3 py-1 font-bold text-muted">{getTrade(t)?.title}</Link>
              ))}
            </div>
            <h2 className="text-2xl font-bold leading-tight">{p.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <DifficultyBadge level={p.difficulty} />
              <span>v{p.version}・{p.updatedAt} 更新</span>
            </div>
          </div>
          <FavoriteButton type="procedure" id={p.id} />
        </div>

        {/* 概要 */}
        <SectionTitle id="overview">概要</SectionTitle>
        <Card>
          <ModalTextView text={p.overview} />
          {p.duration && (
            <p className="mt-3 flex gap-2 text-muted"><Clock className="mt-1 size-5 shrink-0" aria-hidden />{p.duration}</p>
          )}
        </Card>

        {/* 步驟 */}
        <SectionTitle id="steps">施工步驟</SectionTitle>
        <ol className="flex flex-col gap-3">
          {p.steps.map((s) => (
            <li key={s.order}>
              <Card>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-on-primary">{s.order}</span>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                </div>
                {s.media?.map((m) => (
                  <figure key={m.src} className="mt-3">
                    <img src={m.src} alt={m.alt} className="w-full rounded-xl" loading="lazy" />
                    {m.caption && <figcaption className="mt-1 text-sm text-muted">{m.caption}</figcaption>}
                  </figure>
                ))}
                <ModalTextView text={s.body} className="mt-3" />
                {s.specs && (
                  <dl className={`mt-3 grid gap-2 ${master ? 'grid-cols-1 sm:grid-cols-2' : ''}`}>
                    {s.specs.map((sp) => (
                      <div key={sp.label} className="rounded-xl bg-surface-2 px-3 py-2">
                        <dt className="text-sm text-muted">{sp.label}</dt>
                        <dd className={`font-bold ${master ? 'text-lg text-primary-ink' : ''}`}>{sp.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {s.keyPoints && (
                  <ul className="mt-3 flex flex-col gap-1">
                    {s.keyPoints.map((k) => (
                      <li key={k} className="flex gap-2"><CircleCheck className="mt-1 size-5 shrink-0 text-success" aria-hidden />{k}</li>
                    ))}
                  </ul>
                )}
                {s.waitTime && (
                  <p className="mt-3 flex gap-2 rounded-xl border border-line px-3 py-2 text-sm"><Clock className="mt-0.5 size-5 shrink-0 text-primary-ink" aria-hidden />{s.waitTime}</p>
                )}
              </Card>
            </li>
          ))}
        </ol>

        {/* 材料與工具 */}
        <SectionTitle id="materials">材料與工具</SectionTitle>
        <Card>
          <h3 className="mb-2 font-bold text-muted">材料</h3>
          <ul className="divide-y divide-line">
            {p.materials.map((m) => {
              const inner = (
                <>
                  <span className="font-bold">{m.name}</span>
                  {m.spec && <span className="block text-sm text-muted">{m.spec}</span>}
                  {m.qtyNote && <span className="block text-sm text-muted">{m.qtyNote}</span>}
                </>
              );
              return (
                <li key={m.name} className="py-2">
                  {m.materialId ? (
                    <Link to={`/materials/${m.materialId}`} className="flex min-h-12 items-center justify-between gap-2">
                      <span>{inner}</span>
                      <span className="shrink-0 text-sm font-bold text-primary-ink">材料庫 ›</span>
                    </Link>
                  ) : (
                    <div className="min-h-12">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <h3 className="mb-2 mt-4 font-bold text-muted">工具</h3>
          <ul className="flex flex-wrap gap-2">
            {p.tools.map((t) => (
              <li key={t.name} className="rounded-xl bg-surface-2 px-3 py-2">{t.name}{t.note && !master && <span className="text-sm text-muted">（{t.note}）</span>}</li>
            ))}
          </ul>
          {p.calculatorIds?.map((c) => (
            <Link key={c} to={`/tools/${c}`} className="tap mt-3 flex items-center justify-center gap-2 rounded-2xl border-2 border-primary font-bold text-primary-ink">
              <Calculator className="size-5" aria-hidden />用量試算：{getCalculator(c)?.title}
            </Link>
          ))}
        </Card>

        {/* 品管 */}
        <SectionTitle id="qc">常見錯誤</SectionTitle>
        <div className="flex flex-col gap-2">
          {p.commonMistakes.map((m) => (
            <Card key={m.mistake}>
              <div className="font-bold text-danger">✗ {m.mistake}</div>
              {!master && <div className="mt-1 text-sm text-muted">後果：{m.consequence}</div>}
              <div className="mt-1"><b className="text-success">✓ 預防：</b>{m.prevention}</div>
            </Card>
          ))}
        </div>

        <SectionTitle
          action={
            checked.length > 0 && (
              <button type="button" onClick={() => resetChecklist(p.id)} className="tap flex items-center gap-1 font-bold text-primary-ink">
                <RotateCcw className="size-5" aria-hidden />重設
              </button>
            )
          }
        >
          品管檢查清單 <span className="text-base text-muted">{checked.length}/{p.qcChecklist.length}</span>
        </SectionTitle>
        <ul className="flex flex-col gap-2">
          {p.qcChecklist.map((q, i) => {
            const on = checked.includes(i);
            return (
              <li key={q.item}>
                <label className={`flex min-h-14 cursor-pointer gap-3 rounded-2xl border-2 bg-surface p-3 ${on ? 'border-success' : 'border-line'}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleCheck(p.id, i)} className="mt-1 size-7 shrink-0 accent-[var(--c-success)]" />
                  <span>
                    <span className={`block font-bold ${on ? 'text-success' : ''}`}>{q.item}</span>
                    {q.criteria && <span className="block text-sm">標準：{q.criteria}</span>}
                    {q.method && <span className="block text-sm text-muted">方法：{q.method}</span>}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* 安全 */}
        <SectionTitle id="safety">安全注意事項</SectionTitle>
        <div className="flex flex-col gap-2">
          {p.safety.map((s) => {
            const st = safetyStyle[s.level];
            return (
              <div key={s.text} className={`flex gap-3 rounded-2xl border-2 p-3 ${st.cls}`}>
                <st.icon className={`mt-0.5 size-6 shrink-0 ${st.ic}`} aria-label={st.label} />
                <span>{s.text}</span>
              </div>
            );
          })}
        </div>

        {p.relatedTermIds && (
          <>
            <SectionTitle>相關術語</SectionTitle>
            <TermChips ids={p.relatedTermIds} />
          </>
        )}
        {p.relatedProcedureIds && (
          <>
            <SectionTitle>相關工序</SectionTitle>
            <div className="flex flex-col gap-2">{p.relatedProcedureIds.map((r) => <EntryRow key={r} type="procedure" id={r} showType={false} />)}</div>
          </>
        )}
        {p.sources && (
          <p className="mt-6 text-sm text-muted">參考依據：{p.sources.map((s) => s.title + (s.note ? `（${s.note}）` : '')).join('；')}</p>
        )}
        <Disclaimer className="mt-6" />
      </Page>
    </>
  );
}
