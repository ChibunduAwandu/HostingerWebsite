import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';

type ContactFormProps = {
  onSuccess: () => void;
};

export const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    onSuccess();
  };

  return (
    <div className="glass-panel w-[min(100%,420px)] rounded-[28px] p-5 shadow-glass">
      <div className="mb-4">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan/75">
          Direct Signal
        </div>
        <h3 className="font-heading text-xl font-semibold text-white">Start a conversation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Static-first by design. This form currently triggers a local success state, and can be
          wired to Formspree, Resend, or a small backend endpoint.
        </p>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/40"
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          required
          value={name}
        />
        <input
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/40"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <textarea
          className="min-h-28 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan/40"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
          required
          value={message}
        />
        <button className="glass-button justify-center" type="submit">
          <Send size={15} />
          Send
        </button>
      </form>

      {submitted ? (
        <div className="mt-4 rounded-2xl border border-green/20 bg-green/10 px-4 py-3 text-sm text-green">
          Signal received. The beacon just pulsed.
        </div>
      ) : null}
    </div>
  );
};
