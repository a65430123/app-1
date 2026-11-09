import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ModeToggle } from '@/components/ui/ModeToggle';

export function TopBar({ title, back = false }: { title: string; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <header className="pt-safe sticky top-0 z-20 bg-charcoal text-on-charcoal">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-1 px-2">
        {back ? (
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            className="tap -ml-1 flex items-center justify-center rounded-full active:bg-white/10"
            aria-label="返回"
          >
            <ChevronLeft className="size-8" />
          </button>
        ) : (
          <span className="w-2" />
        )}
        <h1 className="min-w-0 flex-1 truncate text-xl font-bold">{title}</h1>
        <ModeToggle />
      </div>
    </header>
  );
}
