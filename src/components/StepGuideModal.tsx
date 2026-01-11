import { X, Terminal, Check, Copy, Wrench } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../services/gemini';

type StepGuideModalProps = {
  projectName: string;
  project?: Project;
  onClose: () => void;
};

export function StepGuideModal({ projectName, project, onClose }: StepGuideModalProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  // If no project is passed (shouldn't happen with real data flow), we could show a loading state or error.
  // For now, let's assume project is present or fallback to empty.
  
  const steps = project?.steps.map((stepText, index) => {
    // Simple heuristic to detect code blocks:
    // If the step contains "Run", "Type", "Command" followed by something that looks like code,
    // or if we just split by newline and check for code-like characters.
    // For simplicity, let's assume the API returns text. 
    // If we want code blocks, we might need to ask the API for them separately or parse markdown.
    // Let's try to parse markdown code blocks if the API returns them (even though we asked for JSON).
    // Or just treat the whole step as description.
    
    return {
      id: index + 1,
      title: `Step ${index + 1}`,
      description: stepText,
      icon: <Wrench size={24} className="text-[var(--color-terminal-green)]" />,
      code: undefined // We'd need smarter parsing to extract code
    };
  }) || [];

  const handleCopyCode = (stepId: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fade-in_0.3s_ease-out] p-4 lg:p-8">
      <div className="bg-[var(--color-dark-bg)] w-full max-w-5xl max-h-[90vh] rounded-3xl border border-[var(--color-border)] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,255,136,0.3)]">
        {/* Header */}
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-mono text-[var(--color-terminal-green)] mb-2">
              Setup Guide
            </h2>
            <p className="text-base text-[var(--color-text-secondary)]">
              {projectName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-[var(--color-charcoal)] border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-terminal-green)] transition-colors"
          >
            <X size={24} className="text-[var(--color-text-primary)]" />
          </button>
        </div>

        {/* Steps Timeline */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-[31px] top-12 bottom-12 w-px bg-[var(--color-border)]" />

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="relative flex gap-6">
                  {/* Step icon */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-[var(--color-charcoal)] border border-[var(--color-border)] flex items-center justify-center">
                    {step.icon}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-[var(--color-text-secondary)] font-mono uppercase tracking-wider">
                          Step {step.id}
                        </span>
                        <h3 className="text-xl font-mono text-[var(--color-text-primary)] mt-1">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-base text-[var(--color-text-secondary)] mb-4 leading-relaxed whitespace-pre-wrap font-sans">
                      {step.description}
                    </p>

                    {/* Code block */}
                    {step.code && (
                      <div className="relative mt-4 rounded-xl bg-black border border-[var(--color-border)] overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 bg-[var(--color-charcoal)]/50 border-b border-[var(--color-border)]">
                          <span className="text-xs text-[var(--color-text-secondary)] font-mono uppercase tracking-wider">
                            Terminal
                          </span>
                          <button
                            onClick={() => handleCopyCode(step.id, step.code!)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[var(--color-surface)] transition-colors text-sm font-mono text-[var(--color-text-secondary)]"
                          >
                            {copiedStep === step.id ? (
                              <>
                                <Check size={14} className="text-[var(--color-terminal-green)]" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="px-5 py-4 overflow-x-auto text-sm font-mono text-[var(--color-terminal-green)] leading-relaxed">
                          {step.code}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--color-surface)] border-t border-[var(--color-border)] px-8 py-5">
          <p className="text-sm text-[var(--color-text-secondary)] text-center font-mono">
            Need help? Check the community forums or documentation
          </p>
        </div>
      </div>
    </div>
  );
}