import { displayWishName, formatWishDate, type Wish } from '@/lib/wishes';

interface WishListCardProps {
  wish: Wish;
  onSelect: (wish: Wish) => void;
}

export default function WishListCard({ wish, onSelect }: WishListCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(wish)}
      className="group flex h-full w-full flex-col rounded-2xl border border-primary-100/80 bg-white p-6 text-left shadow-sm shadow-primary-900/5 transition-all duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-900/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-100"
    >
      <span className="block h-px w-8 bg-primary-300 transition-all duration-500 group-hover:w-14" />
      <p className="mt-4 line-clamp-5 flex-1 whitespace-pre-line leading-relaxed text-neutral-700">
        {wish.message}
      </p>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-primary-50 pt-4 text-sm">
        <span className="truncate font-semibold text-primary-700">- {displayWishName(wish.name)}</span>
        <time dateTime={wish.created_at} className="shrink-0 text-xs text-neutral-500">
          {formatWishDate(wish.created_at)}
        </time>
      </div>
    </button>
  );
}
