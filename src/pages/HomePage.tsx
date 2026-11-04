import { useCallback, useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Toast, { type ToastTone } from '@/components/Toast';
import HeroSection from '@/components/home/HeroSection';
import WishesSection from '@/components/home/WishesSection';
import WishDetailModal from '@/components/home/WishDetailModal';
import WriteWishModal from '@/components/home/WriteWishModal';
import { usePublishedWishes } from '@/hooks/usePublishedWishes';
import type { Wish } from '@/lib/wishes';

const SUBMIT_SUCCESS_MESSAGE =
  'Terima kasih sudah menitipkan harapanmu. Semoga satu per satu menemukan jalannya untuk terwujud.';

interface ToastState {
  message: string;
  tone: ToastTone;
}

export default function HomePage() {
  const {
    wishes,
    phase,
    hasMore,
    isLoadingMore,
    loadMoreFailed,
    reload,
    loadMore,
  } = usePublishedWishes();
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const openWrite = useCallback(() => setIsWriteOpen(true), []);
  const closeWrite = useCallback(() => setIsWriteOpen(false), []);
  const closeDetail = useCallback(() => setSelectedWish(null), []);
  const dismissToast = useCallback(() => setToast(null), []);
  const handleSubmitted = useCallback(
    () => setToast({ message: SUBMIT_SUCCESS_MESSAGE, tone: 'success' }),
    [],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader onWriteClick={openWrite} />

      <main>
        <HeroSection
          wishes={wishes}
          phase={phase}
          onWriteClick={openWrite}
          onSelectWish={setSelectedWish}
          onRetry={reload}
        />
        <WishesSection
          wishes={wishes}
          phase={phase}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMoreFailed={loadMoreFailed}
          onLoadMore={loadMore}
          onRetry={reload}
          onSelectWish={setSelectedWish}
        />
      </main>

      <SiteFooter />

      <WriteWishModal open={isWriteOpen} onClose={closeWrite} onSubmitted={handleSubmitted} />
      <WishDetailModal wish={selectedWish} onClose={closeDetail} />
      <Toast
        message={toast?.message ?? null}
        tone={toast?.tone ?? 'success'}
        onDismiss={dismissToast}
      />
    </div>
  );
}
