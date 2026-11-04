import Modal from '@/components/Modal';
import { displayWishName, formatWishDate, type Wish } from '@/lib/wishes';

interface WishDetailModalProps {
  wish: Wish | null;
  onClose: () => void;
}

export default function WishDetailModal({ wish, onClose }: WishDetailModalProps) {
  return (
    <Modal open={wish !== null} onClose={onClose} label="Detail harapan">
      {wish && (
        <article className="p-6 sm:p-10">
          <div className="mx-auto mt-2 max-w-md rotate-[-1.5deg] rounded-md bg-[#FFFBF6] px-7 py-9 shadow-lg shadow-primary-900/10 ring-1 ring-primary-100 sm:px-9 sm:py-11">
            <span className="block h-px w-12 bg-primary-300" />
            <p className="mt-6 whitespace-pre-line text-lg leading-[1.7] text-neutral-800 sm:text-xl">
              {wish.message}
            </p>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-primary-100 pt-4 text-sm">
              <span className="font-bold text-primary-700">- {displayWishName(wish.name)}</span>
              <time dateTime={wish.created_at} className="text-neutral-500">
                {formatWishDate(wish.created_at)}
              </time>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-neutral-500">
            Setiap harapan punya tempat untuk tumbuh.
          </p>
        </article>
      )}
    </Modal>
  );
}
