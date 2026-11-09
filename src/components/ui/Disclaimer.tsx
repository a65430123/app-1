import { TriangleAlert } from 'lucide-react';

export function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`flex gap-2 rounded-xl bg-warning-bg p-3 text-sm text-ink ${className}`}>
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
      <span>本內容僅供參考，實際依現場狀況、相關法規與專業技師判斷。</span>
    </p>
  );
}
