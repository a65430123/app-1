import { useSettings } from '@/stores/settings';

/** 頂部列的「新手／師傅」切換膠囊 */
export function ModeToggle() {
  const mode = useSettings((s) => s.mode);
  const setMode = useSettings((s) => s.setMode);
  const opt = (value: 'beginner' | 'master', label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      aria-pressed={mode === value}
      className={`min-h-11 rounded-full px-3 text-sm font-bold transition-colors ${
        mode === value ? 'bg-primary text-on-primary' : 'text-on-charcoal/80'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="顯示模式" className="flex rounded-full bg-white/10 p-1">
      {opt('beginner', '新手')}
      {opt('master', '師傅')}
    </div>
  );
}
