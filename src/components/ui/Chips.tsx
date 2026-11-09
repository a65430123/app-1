/** 橫向捲動的篩選晶片 */
export function Chips<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex min-h-12 shrink-0 items-center gap-1 rounded-full border-2 px-4 font-bold ${
            value === o.value ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-muted'
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className="text-sm opacity-80">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}
