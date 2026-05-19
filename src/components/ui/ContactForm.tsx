import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';

type ContactFormProps = {
  onSuccess: () => void;
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          website
        })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? 'Unable to send message right now.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setWebsite('');
      onSuccess();
    } catch (submissionError) {
      setStatus('error');
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to send message right now.'
      );
    }
  };

  return (
    <div className="glass-panel w-[min(100%,420px)] rounded-[28px] p-5 shadow-glass">
      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
          Direct Signal
        </div>
        <h3 className="font-heading text-xl font-semibold text-white">Start a conversation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          This sends directly through the Hostinger deployment using a lightweight backend
          endpoint.
        </p>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="text-xs uppercase tracking-[0.28em] text-slate-400">
          Name
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/40"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
            value={name}
          />
        </label>
        <label className="text-xs uppercase tracking-[0.28em] text-slate-400">
          Email
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/40"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label className="text-xs uppercase tracking-[0.28em] text-slate-400">
          Message
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/40"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell me what you're building, hiring for, or exploring."
            required
            value={message}
          />
        </label>
        <input
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="Website"
          tabIndex={-1}
          value={website}
        />
        <button className="glass-button justify-center" disabled={status === 'submitting'} type="submit">
          <Send size={15} />
          {status === 'submitting' ? 'Transmitting...' : 'Send'}
        </button>
      </form>

      {status === 'success' ? (
        <div className="mt-4 rounded-2xl border border-green/20 bg-green/10 px-4 py-3 text-sm text-green">
          Signal received. The beacon just pulsed.
        </div>
      ) : null}

      {status === 'error' ? (
        <div
          aria-live="polite"
          className="mt-4 rounded-2xl border border-orange/20 bg-orange/10 px-4 py-3 text-sm text-orange-200"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};
