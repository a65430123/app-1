import type { ReactNode } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { useSettings, type FontScale, type Theme, type ViewMode } from '@/stores/settings';

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid rounded-2xl bg-surface-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`tap rounded-xl text-lg font-bold ${value === o.value ? 'bg-primary text-on-primary' : 'text-muted'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <Card className="mb-3">
      <div className="mb-2 text-lg font-bold">{title}</div>
      {hint && <p className="mb-3 text-sm text-muted">{hint}</p>}
      {children}
    </Card>
  );
}

export default function Settings() {
  const s = useSettings();
  return (
    <>
      <TopBar title="設定" back />
      <Page>
        <Row title="顯示模式" hint="新手模式：白話、多解說；師傅模式：精簡、重規格數據">
          <Segmented<ViewMode> value={s.mode} onChange={s.setMode} options={[{ value: 'beginner', label: '新手' }, { value: 'master', label: '師傅' }]} />
        </Row>
        <Row title="外觀">
          <Segmented<Theme>
            value={s.theme}
            onChange={s.setTheme}
            options={[{ value: 'system', label: '跟隨系統' }, { value: 'light', label: '淺色' }, { value: 'dark', label: '深色' }]}
          />
        </Row>
        <Row title="字級">
          <Segmented<FontScale>
            value={s.fontScale}
            onChange={s.setFontScale}
            options={[{ value: 'normal', label: '標準' }, { value: 'large', label: '大' }, { value: 'xlarge', label: '特大' }]}
          />
        </Row>
        <Row title="內容版本" hint="遠端內容更新於 P5 實作">
          <div className="flex items-center justify-between">
            <span className="text-muted">內建內容　—</span>
            <button type="button" disabled className="tap rounded-xl border border-line px-4 font-bold text-muted">檢查更新</button>
          </div>
        </Row>
        <Disclaimer className="mt-4" />
        <p className="mt-4 text-center text-sm text-muted">工程通 v0.1.0（開發預覽）</p>
      </Page>
    </>
  );
}
