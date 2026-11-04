import { supabase } from '@/lib/supabase';

export const WISH_MAX_LENGTH = 500;
export const WISH_NAME_MAX_LENGTH = 60;
export const BUCKET_PREVIEW_COUNT = 8;
export const WISHES_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

export type WishStatus = 'pending' | 'published' | 'rejected';

export const WISH_STATUS_LABEL: Record<WishStatus, string> = {
  pending: 'Menunggu',
  published: 'Dipublikasikan',
  rejected: 'Ditolak',
};

export interface Wish {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
  status: WishStatus;
}

export interface WishCounts {
  total: number;
  published: number;
  pending: number;
  rejected: number;
}

const WISH_COLUMNS = 'id, name, message, created_at, status';

function isWish(row: unknown): row is Wish {
  if (typeof row !== 'object' || row === null) return false;
  const candidate = row as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    (candidate.name === null || typeof candidate.name === 'string') &&
    typeof candidate.message === 'string' &&
    typeof candidate.created_at === 'string' &&
    (candidate.status === 'pending' || candidate.status === 'published' || candidate.status === 'rejected')
  );
}

function parseWishes(rows: unknown): Wish[] {
  if (!Array.isArray(rows)) throw new Error('Format data harapan tidak valid.');
  return rows.filter(isWish);
}

export async function fetchPublishedWishes(from: number, to: number): Promise<Wish[]> {
  const { data, error } = await supabase
    .from('wishes')
    .select(WISH_COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return parseWishes(data);
}

export async function submitWish(name: string | null, message: string): Promise<void> {
  const { error } = await supabase
    .from('wishes')
    .insert({ name, message, status: 'pending' });

  if (error) throw new Error(error.message);
}

export async function fetchWishesByStatus(
  status: WishStatus | null,
  from: number,
  to: number,
): Promise<Wish[]> {
  let query = supabase.from('wishes').select(WISH_COLUMNS);
  if (status) query = query.eq('status', status);

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return parseWishes(data);
}

async function countWishes(status: WishStatus | null): Promise<number> {
  let query = supabase.from('wishes').select('id', { count: 'exact', head: true });
  if (status) query = query.eq('status', status);

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchWishCounts(): Promise<WishCounts> {
  const [total, published, pending, rejected] = await Promise.all([
    countWishes(null),
    countWishes('published'),
    countWishes('pending'),
    countWishes('rejected'),
  ]);
  return { total, published, pending, rejected };
}

export async function updateWishStatus(id: string, status: WishStatus): Promise<void> {
  const { error } = await supabase
    .from('wishes')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteWish(id: string): Promise<void> {
  const { error } = await supabase
    .from('wishes')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatWishDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function displayWishName(name: string | null): string {
  return name && name.trim() ? name : 'Anonim';
}
