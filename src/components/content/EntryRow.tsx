import { LinkRow } from '@/components/ui/Card';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { typeIcon } from '@/components/ui/icons';
import { entryPath, getEntry, typeLabel } from '@/content';
import type { ContentType } from '@/schema';

/** 任一類型內容的通用清單列（收藏、紀錄、搜尋結果共用） */
export function EntryRow({ type, id, showType = true, showDifficulty = true }: { type: ContentType; id: string; showType?: boolean; showDifficulty?: boolean }) {
  const e = getEntry(type, id);
  if (!e) return null;
  const Icon = typeIcon[type];
  return (
    <LinkRow
      to={entryPath(type, id)}
      title={e.title}
      subtitle={(showType ? `${typeLabel[type]}・` : '') + e.summary}
      left={showType ? <Icon className="size-6 shrink-0 text-primary" aria-hidden /> : undefined}
      right={showDifficulty && type === 'procedure' ? <DifficultyBadge level={e.difficulty} /> : undefined}
    />
  );
}
