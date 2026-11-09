import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { getTerm } from '@/content';
import { ModalTextView } from './ModalTextView';

/** 術語晶片：點了從底部彈出解釋卡，不用離開目前頁面 */
export function TermChips({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const t = getTerm(open ?? undefined);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => {
          const term = getTerm(id);
          if (!term) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpen(id)}
              className="min-h-12 rounded-full border-2 border-dashed border-primary px-4 font-bold text-primary-ink active:bg-primary/10"
            >
              {term.title}
            </button>
          );
        })}
      </div>
      {t && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setOpen(null)}>
          <div
            role="dialog"
            aria-label={t.title}
            className="pb-safe w-full max-w-3xl rounded-t-3xl bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-2xl font-bold">{t.title}</div>
                {t.formalName && <div className="text-sm text-muted">正式名稱：{t.formalName}</div>}
              </div>
              <button type="button" onClick={() => setOpen(null)} className="tap flex items-center justify-center rounded-full bg-surface-2" aria-label="關閉">
                <X className="size-6" />
              </button>
            </div>
            <ModalTextView text={t.definition} className="mt-3 text-lg" />
            <Link to={`/glossary/${t.id}`} className="tap mt-4 flex items-center justify-center rounded-2xl bg-primary text-lg font-bold text-on-primary">
              查看完整詞條
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
