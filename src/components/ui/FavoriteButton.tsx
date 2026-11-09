import { Star } from 'lucide-react';
import { useLibrary } from '@/stores/library';
import type { ContentType } from '@/schema';

export function FavoriteButton({ type, id }: { type: ContentType; id: string }) {
  const fav = useLibrary((s) => s.favorites.some((f) => f.type === type && f.id === id));
  const toggle = useLibrary((s) => s.toggleFavorite);
  return (
    <button
      type="button"
      onClick={() => toggle(type, id)}
      aria-pressed={fav}
      aria-label={fav ? '取消收藏' : '加入收藏'}
      className={`tap flex shrink-0 items-center justify-center rounded-full border-2 ${fav ? 'border-primary bg-primary/15' : 'border-line bg-surface'}`}
    >
      <Star className={`size-7 text-primary ${fav ? 'fill-primary' : ''}`} />
    </button>
  );
}
