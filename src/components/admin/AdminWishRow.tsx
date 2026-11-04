import { Check, Trash2, X, RotateCcw } from 'lucide-react';
import { displayWishName, formatWishDate, WISH_STATUS_LABEL, type Wish, type WishStatus } from '@/lib/wishes';

const STATUS_BADGE: Record<WishStatus, string> = {
  pending: 'bg-warning-50 text-warning-700 ring-warning-500/20',
  published: 'bg-success-50 text-success-700 ring-success-500/20',
  rejected: 'bg-error-50 text-error-700 ring-error-500/20',
};

interface AdminWishRowProps {
  wish: Wish;
  busy: boolean;
  onChangeStatus: (wish: Wish, status: WishStatus) => void;
  onRequestDelete: (wish: Wish) => void;
}

export default function AdminWishRow({ wish, busy, onChangeStatus, onRequestDelete }: AdminWishRowProps) {
  const actionClass =
    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm shadow-primary-900/5 ring-1 ring-primary-100/70 transition-shadow duration-300 hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="truncate font-bold text-neutral-800">{displayWishName(wish.name)}</span>
          <span className="text-neutral-400">{formatWishDate(wish.created_at)}</span>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_BADGE[wish.status]}`}
        >
          {WISH_STATUS_LABEL[wish.status]}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-line leading-relaxed text-neutral-700">{wish.message}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-primary-50 pt-4">
        {wish.status !== 'published' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(wish, 'published')}
            className={`${actionClass} bg-success-500 text-white hover:bg-success-700`}
          >
            <Check className="h-3.5 w-3.5" />
            Publikasikan
          </button>
        )}
        {wish.status !== 'rejected' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(wish, 'rejected')}
            className={`${actionClass} bg-neutral-100 text-neutral-700 hover:bg-error-50 hover:text-error-700`}
          >
            <X className="h-3.5 w-3.5" />
            Tolak
          </button>
        )}
        {wish.status === 'published' && (
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
            <RotateCcw className="h-3 w-3" />
            Tolak untuk menarik dari bucket
          </span>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => onRequestDelete(wish)}
          className={`${actionClass} ml-auto text-error-700 hover:bg-error-50`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus
        </button>
      </div>
    </article>
  );
}
