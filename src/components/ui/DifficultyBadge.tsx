import type { Difficulty } from '@/data/placeholder';

const map: Record<Difficulty, { label: string; dots: number; cls: string }> = {
  beginner: { label: '新手', dots: 1, cls: 'text-success border-success' },
  intermediate: { label: '進階', dots: 2, cls: 'text-warning border-warning' },
  master: { label: '師傅', dots: 3, cls: 'text-danger border-danger' },
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const d = map[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 text-sm font-bold ${d.cls}`}>
      {d.label}
      <span aria-hidden className="tracking-tighter">
        {'●'.repeat(d.dots)}
        {'○'.repeat(3 - d.dots)}
      </span>
    </span>
  );
}
