import type { WishCounts } from '@/lib/wishes';

interface AdminStatsProps {
  counts: WishCounts | null;
  failed: boolean;
}

const CARDS: { key: keyof WishCounts; label: string; tone: string }[] = [
  { key: 'total', label: 'Total Harapan', tone: 'text-neutral-800' },
  { key: 'published', label: 'Dipublikasikan', tone: 'text-success-700' },
  { key: 'pending', label: 'Menunggu', tone: 'text-warning-700' },
  { key: 'rejected', label: 'Ditolak', tone: 'text-error-700' },
];

export default function AdminStats({ counts, failed }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {CARDS.map((card) => (
        <div key={card.key} className="rounded-2xl bg-white p-5 shadow-sm shadow-primary-900/5 ring-1 ring-primary-100/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{card.label}</p>
          <p className={`mt-2 text-3xl font-bold ${card.tone}`}>
            {counts ? counts[card.key] : failed ? '-' : '...'}
          </p>
        </div>
      ))}
    </div>
  );
}
