import { useCallback, useEffect, useState } from 'react';
import { Flower2, Loader2, LogOut } from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import AdminWishRow from '@/components/admin/AdminWishRow';
import Modal from '@/components/Modal';
import {
  ADMIN_PAGE_SIZE,
  deleteWish,
  fetchWishCounts,
  fetchWishesByStatus,
  updateWishStatus,
  type Wish,
  type WishCounts,
  type WishStatus,
} from '@/lib/wishes';

type WishFilter = WishStatus | 'all';

const FILTERS: { value: WishFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'published', label: 'Dipublikasikan' },
  { value: 'rejected', label: 'Ditolak' },
];

interface AdminDashboardProps {
  adminEmail: string | null;
  onSignOut: () => void;
}

export default function AdminDashboard({ adminEmail, onSignOut }: AdminDashboardProps) {
  const [counts, setCounts] = useState<WishCounts | null>(null);
  const [countsFailed, setCountsFailed] = useState(false);
  const [filter, setFilter] = useState<WishFilter>('all');
  const [items, setItems] = useState<Wish[]>([]);
  const [listPhase, setListPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Wish | null>(null);

  const statusFilter = filter === 'all' ? null : filter;

  const refreshCounts = useCallback(async () => {
    try {
      setCounts(await fetchWishCounts());
      setCountsFailed(false);
    } catch {
      setCountsFailed(true);
    }
  }, []);

  const loadFirstPage = useCallback(async (status: WishStatus | null) => {
    setListPhase('loading');
    try {
      const rows = await fetchWishesByStatus(status, 0, ADMIN_PAGE_SIZE);
      setItems(rows.slice(0, ADMIN_PAGE_SIZE));
      setHasMore(rows.length > ADMIN_PAGE_SIZE);
      setListPhase('ready');
    } catch {
      setListPhase('error');
    }
  }, []);

  useEffect(() => {
    void refreshCounts();
  }, [refreshCounts]);

  useEffect(() => {
    void loadFirstPage(statusFilter);
  }, [statusFilter, loadFirstPage]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    setActionError(null);
    try {
      const from = items.length;
      const rows = await fetchWishesByStatus(statusFilter, from, from + ADMIN_PAGE_SIZE);
      setItems((current) => [...current, ...rows.slice(0, ADMIN_PAGE_SIZE)]);
      setHasMore(rows.length > ADMIN_PAGE_SIZE);
    } catch {
      setActionError('Harapan lainnya belum bisa dimuat. Coba lagi.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleChangeStatus = async (wish: Wish, status: WishStatus) => {
    setBusyId(wish.id);
    setActionError(null);
    try {
      await updateWishStatus(wish.id, status);
      setItems((current) =>
        statusFilter === null || statusFilter === status
          ? current.map((item) => (item.id === wish.id ? { ...item, status } : item))
          : current.filter((item) => item.id !== wish.id),
      );
      void refreshCounts();
    } catch {
      setActionError('Status harapan belum bisa diubah. Coba lagi.');
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setBusyId(target.id);
    setActionError(null);
    try {
      await deleteWish(target.id);
      setItems((current) => current.filter((item) => item.id !== target.id));
      setPendingDelete(null);
      void refreshCounts();
    } catch {
      setActionError('Harapan belum bisa dihapus. Coba lagi.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-primary-100/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <Flower2 className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-[0.18em] text-neutral-800">PANEL ADMIN</span>
          </a>
          <div className="flex items-center gap-3">
            {adminEmail && <span className="hidden truncate text-xs text-neutral-500 md:inline">{adminEmail}</span>}
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary-50"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">Moderasi Harapan</h1>
          <p className="mt-2 text-sm text-neutral-600">Hanya harapan yang dipublikasikan yang tampil di website.</p>
        </div>

        <AdminStats counts={counts} failed={countsFailed} />

        <section className="space-y-5">
          <div role="tablist" aria-label="Filter status harapan" className="flex flex-wrap gap-2">
            {FILTERS.map((option) => {
              const active = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'bg-white text-neutral-600 ring-1 ring-primary-100 hover:text-primary-700'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {actionError && (
            <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-700">
              {actionError}
            </p>
          )}

          {listPhase === 'loading' && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-primary-400" />
            </div>
          )}

          {listPhase === 'error' && (
            <div className="rounded-3xl border border-dashed border-primary-200 px-6 py-14 text-center">
              <p className="text-neutral-600">Daftar harapan belum bisa dimuat.</p>
              <button
                type="button"
                onClick={() => void loadFirstPage(statusFilter)}
                className="mt-4 rounded-full border border-primary-300 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                Coba lagi
              </button>
            </div>
          )}

          {listPhase === 'ready' && items.length === 0 && (
            <div className="rounded-3xl border border-dashed border-primary-200 bg-primary-50/40 px-6 py-14 text-center text-neutral-600">
              Belum ada harapan pada kategori ini.
            </div>
          )}

          {listPhase === 'ready' && items.length > 0 && (
            <div className="space-y-4">
              {items.map((wish) => (
                <div key={wish.id} className="animate-fade-up">
                  <AdminWishRow
                    wish={wish}
                    busy={busyId === wish.id}
                    onChangeStatus={handleChangeStatus}
                    onRequestDelete={setPendingDelete}
                  />
                </div>
              ))}
            </div>
          )}

          {listPhase === 'ready' && hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-60"
              >
                {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoadingMore ? 'Memuat...' : 'Muat lebih banyak'}
              </button>
            </div>
          )}
        </section>
      </main>

      <Modal open={pendingDelete !== null} onClose={() => setPendingDelete(null)} label="Hapus harapan">
        <div className="p-6 pt-10 sm:p-8 sm:pt-12">
          <h2 className="text-xl font-bold text-neutral-800">Hapus harapan ini?</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Harapan dari {pendingDelete?.name?.trim() || 'Anonim'} akan dihapus permanen dan tidak bisa dikembalikan.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="rounded-full border border-primary-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-primary-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              disabled={busyId !== null}
              className="rounded-full bg-error-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-error-500 disabled:opacity-60"
            >
              Ya, hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
