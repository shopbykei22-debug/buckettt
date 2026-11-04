import { useState, type FormEvent } from 'react';
import { ArrowLeft, Flower2, LogIn, UserPlus } from 'lucide-react';
import { signInAdmin, signUpAdmin } from '@/lib/adminAuth';

type AuthMode = 'signin' | 'signup';

const MIN_PASSWORD_LENGTH = 6;

const inputClass =
  'w-full rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3 text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100';

export default function AdminLogin() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === 'signup';

  const switchMode = () => {
    setMode(isSignUp ? 'signin' : 'signup');
    setError(null);
    setInfo(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }
    if (isSignUp && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      if (isSignUp) {
        const hasSession = await signUpAdmin(trimmedEmail, password);
        if (!hasSession) {
          setInfo('Akun berhasil dibuat. Silakan masuk dengan email dan kata sandimu.');
          setMode('signin');
          setPassword('');
        }
      } else {
        await signInAdmin(trimmedEmail, password);
      }
    } catch {
      setError(
        isSignUp
          ? 'Akun belum bisa dibuat. Pastikan email valid dan belum terdaftar.'
          : 'Email atau kata sandi tidak sesuai.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md animate-fade-up">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke bucket
        </a>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-primary-900/5 ring-1 ring-primary-100 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <Flower2 className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold leading-[1.2] text-neutral-800">
            {isSignUp ? 'Buat Akun Admin' : 'Masuk Panel Admin'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Panel ini digunakan untuk meninjau, mempublikasikan, dan menghapus harapan.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-neutral-700">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="admin@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-neutral-700">
                Kata sandi
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="Masukkan kata sandi"
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-700">
                {error}
              </p>
            )}
            {info && (
              <p role="status" className="rounded-xl bg-success-50 px-4 py-3 text-sm font-medium text-success-700">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-800 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {isSubmitting ? 'Memproses...' : isSignUp ? 'Buat Akun' : 'Masuk'}
            </button>
          </form>

          <button
            type="button"
            onClick={switchMode}
            className="mt-6 w-full text-center text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
          >
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Buat akun admin'}
          </button>
        </div>
      </div>
    </div>
  );
}
