import { X, Download, Usb, Settings, Terminal, Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  code?: string;
  link?: {
    text: string;
    url: string;
  };
};

type StepGuideModalProps = {
  projectName: string;
  onClose: () => void;
};

export function StepGuideModal({ projectName, onClose }: StepGuideModalProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [dashboardUrl, setDashboardUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerateDashboard = async () => {
    setGenerationStatus('generating');
    try {
      // 1. Get Local IP
      const statsRes = await fetch('http://localhost:5000/stats');
      const statsData = await statsRes.json();
      const ip = statsData.ip_address || 'localhost';

      // 2. Generate Dashboard
      const genRes = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_name: 'Legacy Device',
          os_version: 'Unknown'
        })
      });

      if (!genRes.ok) throw new Error('Generation failed');

      setDashboardUrl(`http://${ip}:5000/display`);
      setGenerationStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to backend. Is python app.py running?');
      setGenerationStatus('error');
    }
  };

  if (projectName === 'Legacy Dashboard') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fade-in_0.3s_ease-out] p-4 lg:p-8">
        <div className="bg-[var(--color-dark-bg)] w-full max-w-2xl rounded-3xl border border-[var(--color-border)] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,255,136,0.3)]">
          <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-mono text-[var(--color-terminal-green)]">Legacy Dashboard Setup</h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--color-charcoal)] rounded-lg transition-colors">
              <X size={24} className="text-[var(--color-text-primary)]" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[var(--color-terminal-green)]/10 flex items-center justify-center mb-2">
              <Terminal size={40} className="text-[var(--color-terminal-green)]" />
            </div>

            <p className="text-[var(--color-text-secondary)] text-lg">
              Revive your old device by turning it into a futuristic system monitor.
            </p>

            {generationStatus === 'idle' && (
              <button
                onClick={handleGenerateDashboard}
                className="px-8 py-4 rounded-xl bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-mono text-lg uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all"
              >
                Generate Dashboard
              </button>
            )}

            {generationStatus === 'generating' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[var(--color-terminal-green)] border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-[var(--color-terminal-green)] animate-pulse">
                  Consulting Gemini AI...
                </p>
              </div>
            )}

            {generationStatus === 'success' && (
              <div className="w-full bg-[var(--color-surface)] border border-[var(--color-terminal-green)] rounded-xl p-6 animate-[scale-in_0.3s_ease-out]">
                <h3 className="text-[var(--color-terminal-green)] font-mono text-xl mb-4">Dashboard Ready!</h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  Open this URL on your legacy device:
                </p>
                <div className="bg-black p-4 rounded-lg border border-[var(--color-border)] mb-4 break-all">
                  <code className="text-[var(--color-electric-blue)] text-lg">{dashboardUrl}</code>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Make sure the device is on the same Wi-Fi network.
                </p>
              </div>
            )}

            {generationStatus === 'error' && (
              <div className="text-red-500 font-mono bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  const steps: Step[] = [
    {
      id: 1,
      title: 'Download Ubuntu Server ISO',
      description: 'Download the latest LTS version of Ubuntu Server. This will be the operating system for your Pi-Hole.',
      icon: <Download size={24} className="text-[var(--color-terminal-green)]" />,
      link: {
        text: 'ubuntu.com/download/server',
        url: 'https://ubuntu.com/download/server'
      }
    },
    {
      id: 2,
      title: 'Flash to USB Drive using BalenaEtcher',
      description: 'Use BalenaEtcher to create a bootable USB drive. This will allow you to install Ubuntu on your PC.',
      icon: <Usb size={24} className="text-[var(--color-electric-blue)]" />,
      link: {
        text: 'balena.io/etcher',
        url: 'https://balena.io/etcher'
      }
    },
    {
      id: 3,
      title: 'Access BIOS and Boot from USB',
      description: 'Restart the Dell Optiplex and press F12 during startup to access the boot menu. Select your USB drive.',
      icon: <Settings size={24} className="text-[var(--color-neon-purple)]" />
    },
    {
      id: 4,
      title: 'Install Ubuntu Server',
      description: 'Follow the installation wizard. Choose default options and set up your username and password.',
      icon: <Terminal size={24} className="text-[var(--color-terminal-green)]" />
    },
    {
      id: 5,
      title: 'Update System Packages',
      description: 'After installation, update all system packages to ensure you have the latest security patches.',
      icon: <Terminal size={24} className="text-[var(--color-electric-blue)]" />,
      code: 'sudo apt-get update && sudo apt-get upgrade -y'
    },
    {
      id: 6,
      title: 'Install Docker',
      description: 'Install Docker to run Pi-Hole in a container. This keeps everything organized and easy to manage.',
      icon: <Terminal size={24} className="text-[var(--color-terminal-green)]" />,
      code: 'curl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh'
    },
    {
      id: 7,
      title: 'Deploy Pi-Hole Container',
      description: 'Run the Pi-Hole Docker container. This will start blocking ads on your network.',
      icon: <Terminal size={24} className="text-[var(--color-neon-purple)]" />,
      code: 'docker run -d \\\n  --name pihole \\\n  -p 53:53/tcp -p 53:53/udp \\\n  -p 80:80 \\\n  -e TZ="America/New_York" \\\n  -v "pihole:/etc/pihole" \\\n  --restart=unless-stopped \\\n  pihole/pihole:latest'
    },
    {
      id: 8,
      title: 'Configure Router DNS',
      description: 'Set your router\'s DNS server to point to the IP address of your Pi-Hole. All devices will now use it.',
      icon: <Check size={24} className="text-[var(--color-terminal-green)]" />
    }
  ];

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

                    <p className="text-base text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Link */}
                    {step.link && (
                      <a
                        href={step.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-lg bg-[var(--color-terminal-green)]/10 border border-[var(--color-terminal-green)]/30 text-[var(--color-terminal-green)] text-sm font-mono hover:bg-[var(--color-terminal-green)]/20 transition-colors"
                      >
                        {step.link.text} →
                      </a>
                    )}

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