import { Flower2 } from 'lucide-react';

interface SiteHeaderProps {
  onWriteClick: () => void;
}

export default function SiteHeader({ onWriteClick }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-primary-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 transition-transform duration-500 group-hover:rotate-12">
            <Flower2 className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold tracking-[0.18em] text-neutral-800">BUCKET HARAPAN</span>
        </a>

        <nav className="flex items-center gap-2 sm:gap-6">
          <a
            href="#harapan"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-primary-700 sm:inline-block"
          >
            Daftar Harapan
          </a>
          <button
            type="button"
            onClick={onWriteClick}
            className="rounded-full bg-primary-500 px-4 py-2 text-sm font-bold text-neutral-800 shadow-sm shadow-primary-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white active:translate-y-0"
          >
            Tulis Harapan
          </button>
        </nav>
      </div>
    </header>
  );
}
