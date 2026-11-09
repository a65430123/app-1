import { Lightbulb } from 'lucide-react';
import type { ModalText } from '@/schema';
import { useSettings } from '@/stores/settings';

/**
 * 依顯示模式呈現文字：
 * - 新手：default ＋「白話補充」框（beginner）
 * - 師傅：master（沒有則用 default）
 */
export function ModalTextView({ text, className = '' }: { text: ModalText; className?: string }) {
  const mode = useSettings((s) => s.mode);
  if (mode === 'master') return <p className={className}>{text.master ?? text.default}</p>;
  return (
    <div className={className}>
      <p>{text.default}</p>
      {text.beginner && (
        <p className="mt-2 flex gap-2 rounded-xl bg-primary/10 p-3 text-[0.95rem]">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary-ink" aria-hidden />
          <span>
            <b className="text-primary-ink">白話說明　</b>
            {text.beginner}
          </span>
        </p>
      )}
    </div>
  );
}
