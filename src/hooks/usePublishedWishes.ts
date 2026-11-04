import { useCallback, useEffect, useState } from 'react';
import { fetchPublishedWishes, WISHES_PAGE_SIZE, type Wish } from '@/lib/wishes';

type LoadPhase = 'loading' | 'ready' | 'error';

export function usePublishedWishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [phase, setPhase] = useState<LoadPhase>('loading');
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  const loadInitial = useCallback(async () => {
    setPhase('loading');
    try {
      const rows = await fetchPublishedWishes(0, WISHES_PAGE_SIZE);
      setWishes(rows.slice(0, WISHES_PAGE_SIZE));
      setHasMore(rows.length > WISHES_PAGE_SIZE);
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const from = wishes.length;
      const rows = await fetchPublishedWishes(from, from + WISHES_PAGE_SIZE);
      setWishes((current) => [...current, ...rows.slice(0, WISHES_PAGE_SIZE)]);
      setHasMore(rows.length > WISHES_PAGE_SIZE);
    } catch {
      setLoadMoreFailed(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [wishes.length]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  return {
    wishes,
    phase,
    hasMore,
    isLoadingMore,
    loadMoreFailed,
    reload: loadInitial,
    loadMore,
  };
}
