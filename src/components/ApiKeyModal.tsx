import { useState, useEffect } from 'react';
import { X, Key, Save, ExternalLink } from 'lucide-react';

type ApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  onReset?: () => void;
  initialKey?: string;
};

export function ApiKeyModal({ isOpen, onClose, onSave, onReset, initialKey = '' }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(initialKey);

  useEffect(() => {
    setApiKey(initialKey);
  }, [initialKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-xl font-mono text-[var(--color-text-primary)] flex items-center gap-2">
            <Key className="text-[var(--color-terminal-green)]" size={20} />
            API Configuration
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {onReset && (
            <div className="pt-4 border-t border-[var(--color-border)]">
              <h3 className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Danger Zone
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Reset your profile and onboarding data.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset your profile? This cannot be undone.')) {
                      onReset();
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-mono text-xs uppercase tracking-wider"
                >
                  Reset Info
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-charcoal)] transition-colors font-mono text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
