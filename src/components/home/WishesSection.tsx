import { Loader2, RotateCcw } from 'lucide-react';
import WishListCard from '@/components/home/WishListCard';
import type { Wish } from '@/lib/wishes';

interface WishesSectionProps {
  wishes: Wish[];
  phase: 'loading' | 'ready' | 'error';
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreFailed: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  onSelectWish: (wish: Wish) => void;
}

export default function WishesSection({
  wishes,
  phase,
  hasMore,
  isLoadingMore,
  loadMoreFailed,
  onLoadMore,
  onRetry,
  onSelectWish,
}: WishesSectionProps) {
  return (
    <section id="harapan" className="scroll-mt-20 border-t border-primary-100/70 bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-600">Diurutkan dari yang terbaru</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] text-neutral-800 sm:text-4xl">
            Harapan yang Telah Dititipkan
          </h2>
        </div>

        {phase === 'loading' && (
          <div className="mt-12 flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-primary-400" />
          </div>
        )}

        {phase === 'error' && (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-primary-200 px-6 py-14 text-center">
            <p className="text-neutral-600">Daftar harapan belum bisa dimuat. Periksa koneksimu lalu coba lagi.</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full border border-primary-300 px-5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              <RotateCcw className="h-4 w-4" />
              Coba lagi
            </button>
          </div>
        )}

        {phase === 'ready' && wishes.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-primary-200 bg-primary-50/40 px-6 py-16 text-center">
            <p className="mx-auto max-w-sm leading-relaxed text-neutral-600">
              Belum ada harapan yang dititipkan. Jadilah orang pertama yang menuliskannya.
            </p>
          </div>
        )}

        {phase === 'ready' && wishes.length > 0 && (
          <>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {wishes.map((wish, index) => (
                <div
                  key={wish.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 11) * 50}ms` }}
                >
                  <WishListCard wish={wish} onSelect={onSelectWish} />
                </div>
              ))}
            </div>

            {loadMoreFailed && (
              <p role="alert" className="mt-8 text-center text-sm text-error-700">
                Harapan lainnya belum bisa dimuat. Coba lagi sebentar.
              </p>
            )}

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-white px-7 py-3 font-semibold text-primary-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoadingMore ? 'Memuat...' : 'Muat lebih banyak'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
