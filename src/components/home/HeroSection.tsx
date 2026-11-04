import { ArrowDown, PenLine } from 'lucide-react';
import BucketGarden from '@/components/home/BucketGarden';
import type { Wish } from '@/lib/wishes';

interface HeroSectionProps {
  wishes: Wish[];
  phase: 'loading' | 'ready' | 'error';
  onWriteClick: () => void;
  onSelectWish: (wish: Wish) => void;
  onRetry: () => void;
}

export default function HeroSection({ wishes, phase, onWriteClick, onSelectWish, onRetry }: HeroSectionProps) {
  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-2 md:gap-10 md:pb-24 md:pt-20">
        <div className="text-center md:text-left">
          <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.3em] text-primary-600">
            Digital wish bouquet
          </p>
          <h1 className="mt-4 animate-fade-up text-4xl font-bold leading-[1.2] text-neutral-800 [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            BUCKET HARAPAN
          </h1>
          <p className="mt-4 animate-fade-up text-lg font-medium text-primary-700 [animation-delay:160ms] sm:text-xl">
            "Setiap harapan punya tempat untuk tumbuh."
          </p>
          <p className="mx-auto mt-5 max-w-md animate-fade-up leading-relaxed text-neutral-600 [animation-delay:240ms] md:mx-0">
            Tuliskan harapan, doa, impian, atau hal baik yang ingin kamu wujudkan. Biarkan setiap tulisan menjadi bagian dari bucket harapan ini.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:320ms] sm:flex-row sm:justify-center md:justify-start">
            <button
              type="button"
              onClick={onWriteClick}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-7 py-3.5 font-bold text-neutral-800 shadow-lg shadow-primary-300/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white sm:w-auto"
            >
              <PenLine className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
              Tulis Harapan
            </button>
            <a
              href="#harapan"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-200 bg-white px-7 py-3.5 font-bold text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-700 sm:w-auto"
            >
              Lihat Harapan
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="relative animate-fade-in [animation-delay:200ms]">
          <div className="rounded-[2.5rem] bg-gradient-to-b from-white to-primary-50/80 p-6 shadow-xl shadow-primary-900/5 ring-1 ring-primary-100 sm:p-10">
            {phase === 'loading' && (
              <div className="mx-auto flex aspect-[10/11] w-full max-w-md items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500" />
              </div>
            )}
            {phase === 'error' && (
              <div className="mx-auto flex aspect-[10/11] w-full max-w-md flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm leading-relaxed text-neutral-600">Harapan belum bisa dimuat saat ini.</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-full border border-primary-300 px-5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                >
                  Coba lagi
                </button>
              </div>
            )}
            {phase === 'ready' && <BucketGarden wishes={wishes} onSelect={onSelectWish} />}
          </div>
        </div>
      </div>
    </section>
  );
}
