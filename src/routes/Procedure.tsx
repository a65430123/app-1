import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Placeholder } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { procedures } from '@/data/placeholder';
import { useSettings } from '@/stores/settings';
import NotFound from './NotFound';

const sections = [
  { id: 'overview', label: '概要' },
  { id: 'steps', label: '步驟' },
  { id: 'materials', label: '材料工具' },
  { id: 'qc', label: '品管' },
  { id: 'safety', label: '安全' },
];

export default function Procedure() {
  const { id } = useParams();
  const mode = useSettings((s) => s.mode);
  const p = procedures.find((x) => x.id === id);
  if (!p) return <NotFound />;

  return (
    <>
      <TopBar title={p.title} back />
      {/* 黏性錨點分頁籤 */}
      <nav className="sticky top-16 z-10 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 py-1">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="flex min-h-12 shrink-0 items-center rounded-full px-4 font-bold text-muted active:bg-surface-2">
              {s.label}
            </a>
          ))}
        </div>
      </nav>
      <Page>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{p.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <DifficultyBadge level={p.difficulty} />
              <span>版本 —　·　更新日 —</span>
            </div>
          </div>
          <button type="button" className="tap flex items-center justify-center rounded-full border border-line bg-surface" aria-label="收藏">
            <Star className="size-7 text-primary" />
          </button>
        </div>

        <div className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-sm text-muted">
          目前為「{mode === 'beginner' ? '新手模式：顯示白話解說與補充' : '師傅模式：精簡條列、突出規格數據'}」
        </div>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-32">
            <h3 className="mb-2 mt-6 text-xl font-bold">{s.label}</h3>
            <Placeholder text={`${s.label}內容（P2 由 /content 載入）`} />
          </section>
        ))}

        <Disclaimer className="mt-8" />
      </Page>
    </>
  );
}
