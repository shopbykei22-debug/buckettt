import { Flower2 } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-primary-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-12 text-center sm:px-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <Flower2 className="h-5 w-5" />
        </span>
        <p className="max-w-md font-medium leading-relaxed text-neutral-700">
          Setiap tulisan adalah cerita, setiap harapan punya kemungkinan.
        </p>
        <p className="text-sm text-neutral-500">Bucket Harapan © 2026</p>
        <a
          href="/admin"
          className="mt-2 text-xs font-medium text-neutral-400 transition-colors hover:text-primary-700"
        >
          Masuk sebagai admin
        </a>
      </div>
    </footer>
  );
}
