import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastTone = 'success' | 'error';

interface ToastProps {
  message: string | null;
  tone: ToastTone;
  onDismiss: () => void;
}

export default function Toast({ message, tone, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isSuccess = tone === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-6 z-[60] mx-auto flex max-w-md animate-fade-up items-start gap-3 rounded-2xl bg-white p-4 shadow-xl shadow-primary-900/15 ring-1 ring-black/5"
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="flex-1 text-sm leading-relaxed text-neutral-700">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="rounded-full p-1 text-neutral-400 transition-colors hover:text-neutral-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
