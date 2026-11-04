import { useEffect, useState } from 'react';
import { Flower2, LogOut, ShieldAlert } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLogin from '@/components/admin/AdminLogin';
import { checkIsAdmin, signOutAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

type AdminPhase = 'checking' | 'signed-out' | 'not-admin' | 'admin' | 'error';

export default function AdminPage() {
  const [phase, setPhase] = useState<AdminPhase>('checking');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!session) {
          setAdminEmail(null);
          setPhase('signed-out');
          return;
        }

        setAdminEmail(session.user.email ?? null);
        setPhase('checking');
        try {
          const isAdmin = await checkIsAdmin(session.user.id);
          setPhase(isAdmin ? 'admin' : 'not-admin');
        } catch {
          setPhase('error');
        }
      })();
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } catch {
      setPhase('error');
    }
  };

  if (phase === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  if (phase === 'signed-out') return <AdminLogin />;

  if (phase === 'admin') {
    return <AdminDashboard adminEmail={adminEmail} onSignOut={handleSignOut} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md animate-fade-up rounded-3xl bg-white p-8 text-center shadow-xl shadow-primary-900/5 ring-1 ring-primary-100 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-700">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-neutral-800">
          {phase === 'error' ? 'Akses belum bisa diperiksa' : 'Akun ini belum punya akses admin'}
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-600">
          {phase === 'error'
            ? 'Terjadi kendala saat memeriksa akses. Muat ulang halaman atau coba masuk kembali.'
            : 'Hubungi pengelola Bucket Harapan untuk mendapatkan akses moderasi.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-200 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-primary-50"
          >
            <Flower2 className="h-4 w-4" />
            Kembali ke bucket
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
