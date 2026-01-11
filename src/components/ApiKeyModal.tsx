import { useState, useEffect } from 'react';
import { X, Key, Save, ExternalLink } from 'lucide-react';

type ApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  initialKey?: string;
};

export function ApiKeyModal({ isOpen, onClose, onSave, initialKey = '' }: ApiKeyModalProps) {
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
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
              Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono text-sm focus:border-[var(--color-terminal-green)] focus:outline-none transition-colors placeholder:text-[var(--color-text-secondary)]/50"
              required
            />
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
              Don't have a key? 
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-terminal-green)] hover:underline flex items-center gap-0.5"
              >
                Get one here <ExternalLink size={10} />
              </a>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-charcoal)] transition-colors font-mono text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-mono text-sm uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              <Save size={16} />
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
