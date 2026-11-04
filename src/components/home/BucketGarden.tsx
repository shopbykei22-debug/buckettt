import type { CSSProperties } from 'react';
import { BUCKET_PREVIEW_COUNT, displayWishName, type Wish } from '@/lib/wishes';
import BucketIllustration from '@/components/home/BucketIllustration';

interface Slot {
  left: string;
  top: string;
  tilt: number;
}

const SLOTS: Slot[] = [
  { left: '4%', top: '4%', tilt: -7 },
  { left: '36%', top: '0%', tilt: 3 },
  { left: '68%', top: '7%', tilt: -4 },
  { left: '0%', top: '38%', tilt: 4 },
  { left: '72%', top: '40%', tilt: 6 },
  { left: '20%', top: '28%', tilt: -3 },
  { left: '50%', top: '26%', tilt: -6 },
  { left: '36%', top: '62%', tilt: 2 },
];

const PAPER_TONES = ['bg-white', 'bg-[#FFFBF6]', 'bg-[#FFF3F7]', 'bg-[#FFFDF8]'];

interface BucketGardenProps {
  wishes: Wish[];
  onSelect: (wish: Wish) => void;
}

export default function BucketGarden({ wishes, onSelect }: BucketGardenProps) {
  const visible = wishes.slice(0, Math.min(BUCKET_PREVIEW_COUNT, SLOTS.length));

  return (
    <div className="relative mx-auto aspect-[10/11] w-full max-w-md">
      <BucketIllustration layer="back" className="absolute inset-0 h-full w-full drop-shadow-[0_18px_24px_rgba(142,63,94,0.12)]" />

      {visible.map((wish, index) => {
        const slot = SLOTS[index];
        const style = {
          left: slot.left,
          top: slot.top,
          animationDelay: `${index * 140}ms`,
        } satisfies CSSProperties;

        return (
          <div key={wish.id} className="absolute w-[30%] animate-card-in" style={style}>
            <button
              type="button"
              onClick={() => onSelect(wish)}
              aria-label={`Buka harapan dari ${displayWishName(wish.name)}`}
              style={{ '--tilt': `${slot.tilt}deg` } as CSSProperties}
              className={`wish-tilt block w-full cursor-pointer rounded-md border border-primary-100 ${PAPER_TONES[index % PAPER_TONES.length]} p-2.5 text-left shadow-md shadow-primary-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 sm:p-3`}
            >
              <span className="line-clamp-4 block text-[10px] leading-snug text-neutral-700 sm:text-xs sm:leading-relaxed">
                {wish.message}
              </span>
              <span className="mt-1.5 block truncate text-[9px] font-bold text-primary-700 sm:text-[11px]">
                - {displayWishName(wish.name)}
              </span>
            </button>
          </div>
        );
      })}

      <BucketIllustration layer="front" className="pointer-events-none absolute inset-0 h-full w-full" />

      {visible.length === 0 && (
        <p className="absolute inset-x-6 top-[18%] text-center text-sm leading-relaxed text-neutral-500">
          Bucket ini masih menunggu harapan pertamanya.
        </p>
      )}
    </div>
  );
}
