import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Placeholder } from '@/components/ui/Card';

const filters = ['全部', '工序', '材料', '術語', '計算機'];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  return (
    <>
      <TopBar title="搜尋" />
      <Page>
        <label className="tap flex items-center gap-3 rounded-2xl border-2 border-primary bg-surface px-4">
          <SearchIcon className="size-6 text-primary" aria-hidden />
          <input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
            placeholder="例：粉光、PU 防水、ㄏㄚ ㄇㄧˋ"
            className="h-14 min-w-0 flex-1 bg-transparent text-lg outline-none"
          />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f, i) => (
            <span key={f} className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 font-bold ${i === 0 ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-muted'}`}>
              {f}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <Placeholder text={q ? `「${q}」的搜尋結果（P3 實作）` : '輸入關鍵字開始搜尋（P3 實作）'} />
        </div>
      </Page>
    </>
  );
}
