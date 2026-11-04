import { useRef, useState, type FormEvent } from 'react';
import { Info, Send } from 'lucide-react';
import Modal from '@/components/Modal';
import { submitWish, WISH_MAX_LENGTH, WISH_NAME_MAX_LENGTH } from '@/lib/wishes';

const SUBMIT_COOLDOWN_MS = 30_000;

interface WriteWishModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

const inputClass =
  'w-full rounded-2xl border border-primary-100 bg-primary-50/40 px-4 py-3 text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100';

export default function WriteWishModal({ open, onClose, onSubmitted }: WriteWishModalProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSubmittedAt = useRef(0);

  const trimmedMessage = message.trim();

  const resetForm = () => {
    setName('');
    setMessage('');
    setConsent(false);
    setError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (honeypot) {
      resetForm();
      onClose();
      return;
    }

    if (!trimmedMessage) {
      setError('Tulis harapanmu terlebih dahulu.');
      return;
    }
    if (!consent) {
      setError('Centang persetujuan publikasi untuk mengirim harapanmu.');
      return;
    }

    const elapsed = Date.now() - lastSubmittedAt.current;
    if (elapsed < SUBMIT_COOLDOWN_MS) {
      const seconds = Math.ceil((SUBMIT_COOLDOWN_MS - elapsed) / 1000);
      setError(`Mohon tunggu ${seconds} detik sebelum mengirim harapan lain.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await submitWish(name.trim() || null, trimmedMessage);
      lastSubmittedAt.current = Date.now();
      resetForm();
      onSubmitted();
      onClose();
    } catch {
      setError('Harapanmu belum bisa dikirim. Coba lagi beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} label="Titipkan Harapanmu">
      <form onSubmit={handleSubmit} className="relative p-6 sm:p-8" noValidate>
        <div className="relative mx-auto mb-6 mt-2 w-fit rotate-[-2deg] rounded-md bg-[#FFFBF6] px-6 py-4 shadow-md shadow-primary-900/10 ring-1 ring-primary-100">
          <h2 className="text-xl font-bold leading-[1.2] text-neutral-800">Titipkan Harapanmu</h2>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            Tidak harus sempurna. Tuliskan saja apa yang ingin kamu harapkan.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="wish-name" className="mb-2 block text-sm font-semibold text-neutral-700">
              Nama atau panggilan <span className="font-normal text-neutral-400">(opsional)</span>
            </label>
            <input
              id="wish-name"
              type="text"
              value={name}
              maxLength={WISH_NAME_MAX_LENGTH}
              onChange={(event) => setName(event.target.value)}
              placeholder="Masukkan nama atau anonim..."
              autoComplete="nickname"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="wish-message" className="mb-2 block text-sm font-semibold text-neutral-700">
              Tulisan harapan
            </label>
            <textarea
              id="wish-message"
              rows={5}
              value={message}
              maxLength={WISH_MAX_LENGTH}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tulis harapanmu di sini..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
            <p className="mt-1.5 text-right text-xs text-neutral-400">
              {message.length} / {WISH_MAX_LENGTH}
            </p>
          </div>

          <div className="flex gap-3 rounded-2xl bg-primary-50/70 p-4 text-sm leading-relaxed text-neutral-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <p>Harapanmu akan menjadi bagian dari Bucket Harapan dan dapat dibaca oleh pengunjung website lainnya.</p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-700">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-primary-300 text-primary-600 focus:ring-primary-300"
            />
            <span>Saya bersedia tulisan harapan ini ditampilkan secara publik di website.</span>
          </label>

          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          {error && (
            <p role="alert" className="rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 font-bold text-neutral-800 shadow-lg shadow-primary-300/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-500 disabled:hover:text-neutral-800"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700/30 border-t-neutral-800" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? 'Mengirim...' : 'Kirim Harapan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
