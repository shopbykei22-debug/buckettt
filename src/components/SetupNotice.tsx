import { Flower2, Settings } from 'lucide-react';

export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl shadow-primary-900/5 ring-1 ring-primary-100 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <Flower2 className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-neutral-800">Koneksi database belum siap</h1>
        <p className="mt-3 leading-relaxed text-neutral-600">
          Bucket Harapan membutuhkan koneksi ke Supabase untuk menyimpan dan menampilkan harapan. Tambahkan
          konfigurasi berikut pada lingkungan proyek, lalu muat ulang halaman ini.
        </p>
        <ul className="mt-6 space-y-2 rounded-2xl bg-primary-50/60 p-5 text-left text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <Settings className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <span>
              <code className="font-mono text-xs">VITE_SUPABASE_URL</code>: alamat proyek Supabase
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Settings className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <span>
              <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>: kunci publik (anon key) proyek
            </span>
          </li>
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-neutral-500">
          Jangan pernah memasukkan service role key ke dalam frontend.
        </p>
      </div>
    </div>
  );
}
