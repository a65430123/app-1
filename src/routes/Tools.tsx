import { Calculator } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { calculators } from '@/content';

export default function Tools() {
  return (
    <>
      <TopBar title="工程計算機" />
      <Page>
        <div className="flex flex-col gap-2">
          {calculators.map((c) => (
            <LinkRow key={c.id} to={`/tools/${c.id}`} title={c.title} subtitle={c.summary}
              left={<span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15"><Calculator className="size-7 text-primary-ink" aria-hidden /></span>} />
          ))}
        </div>
        <Disclaimer className="mt-6" />
      </Page>
    </>
  );
}
