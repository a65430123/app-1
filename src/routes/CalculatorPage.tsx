import { useParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { Placeholder } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { calculators } from '@/data/placeholder';
import NotFound from './NotFound';

export default function CalculatorPage() {
  const { calcId } = useParams();
  const c = calculators.find((x) => x.id === calcId);
  if (!c) return <NotFound />;
  return (
    <>
      <TopBar title={c.title} back />
      <Page>
        <p className="mb-4 text-muted">{c.desc}</p>
        <div className="flex flex-col gap-3">
          <Placeholder text="輸入欄位（P4 實作）" />
          <Placeholder text="計算結果（大字顯示）" />
          <Placeholder text="▸ 顯示公式：公式、代入值、可調係數" />
        </div>
        <Disclaimer className="mt-6" />
      </Page>
    </>
  );
}
