import { Calculator } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Page } from '@/components/layout/AppShell';
import { LinkRow } from '@/components/ui/Card';
import { Disclaimer } from '@/components/ui/Disclaimer';
import { calculators } from '@/data/placeholder';

export default function Tools() {
  return (
    <>
      <TopBar title="工程計算機" />
      <Page>
        <div className="flex flex-col gap-2">
          {calculators.map((c) => (
            <LinkRow key={c.id} to={`/tools/${c.id}`} title={c.title} subtitle={c.desc} right={<Calculator className="size-6 text-primary" aria-hidden />} />
          ))}
        </div>
        <Disclaimer className="mt-6" />
      </Page>
    </>
  );
}
