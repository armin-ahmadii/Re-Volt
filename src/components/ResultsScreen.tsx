import { useState } from 'react';
import { ArrowLeft, CheckCircle, Shield, Server, Wrench, DollarSign, Recycle, AlertTriangle, List } from 'lucide-react';
import type { ScanData } from '../App';

type Project = {
  id: string;
  title: string;
  icon: React.ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  difficultyLevel: number;
  cost: string;
  description: string;
};

type ResultsScreenProps = {
  scannedItem: ScanData;
  onBack: () => void;
  onOpenGuide: (projectName: string) => void;
};

export function ResultsScreen({ scannedItem, onBack, onOpenGuide }: ResultsScreenProps) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const projects: Project[] = [
    {
      id: '1',
      title: 'Pi-Hole Network Blocker',
      icon: <Shield size={32} className="text-[var(--color-terminal-green)]" />,
      difficulty: 'Easy',
      difficultyLevel: 30,
      cost: '$0 (Hardware Owned)',
      description: 'Wipe Windows. Install Linux (Ubuntu Server). Run a Docker container for Pi-Hole to block ads on your entire house\'s Wi-Fi.'
    },
    {
      id: '2',
      title: 'Plex Media Server',
      icon: <Server size={32} className="text-[var(--color-electric-blue)]" />,
      difficulty: 'Easy',
      difficultyLevel: 35,
      cost: '$0 (Hardware Owned)',
      description: 'Transform this PC into a personal streaming server. Install Plex to stream your media library to any device in your home.'
    },
    {
      id: '3',
      title: 'Home Lab Server',
      icon: <Wrench size={32} className="text-[var(--color-neon-purple)]" />,
      difficulty: 'Medium',
      difficultyLevel: 60,
      cost: '$0 (Hardware Owned)',
      description: 'Set up a virtualization environment with Proxmox. Run multiple VMs for testing, learning, and development projects.'
    },
    {
      id: '4',
      title: 'Legacy Dashboard',
      icon: <DollarSign size={32} className="text-[var(--color-terminal-green)]" />, // Replaced Terminal with DollarSign as placeholder if Terminal missing, or import Terminal
      difficulty: 'Easy',
      difficultyLevel: 20,
      cost: '$0 (Hardware Owned)',
      description: 'Repurpose this device into a retro-futuristic dashboard. Displays real-time system stats (CPU, RAM, Temp) with a cyberpunk aesthetic.'
    }
  ];

  const selectedProject = projects[selectedProjectIndex];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-dark-bg)] animate-[scale-in_0.4s_ease-out]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-dark-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-8 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-terminal-green)] transition-colors"
          >
            <ArrowLeft size={24} className="text-[var(--color-text-primary)]" />
          </button>
          <div>
            <h2 className="text-lg font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
              Scan Results
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-8 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[500px,1fr] gap-8">
          {/* Left Column - Identity Card & Analysis */}
          <div className="space-y-6">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
              {/* Image */}
              <div className="relative h-64 bg-[var(--color-charcoal)]">
                <img
                  src={scannedItem.image}
                  alt={scannedItem.name}
                  className="w-full h-full object-cover"
                />
                {/* Identified Badge */}
                <div className="absolute top-6 right-6 bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] px-4 py-2 rounded-full flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                  <CheckCircle size={16} />
                  Identified
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-2xl font-mono text-[var(--color-terminal-green)] mb-2">
                  {scannedItem.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] font-mono mb-1">
                  Model: {scannedItem.model || 'Unknown'}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] font-mono">
                  Year: {scannedItem.year || 'Unknown'}
                </p>
              </div>
            </div>

            {/* Recyclability Score */}
            {scannedItem.recyclability_score !== undefined && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Recycle className="text-[var(--color-terminal-green)]" size={24} />
                  <h4 className="text-lg font-mono text-[var(--color-text-primary)] uppercase tracking-wider">
                    Recyclability Score
                  </h4>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-mono text-[var(--color-terminal-green)]">
                    {scannedItem.recyclability_score}
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)] mb-1">/100</span>
                </div>
                <div className="h-3 bg-[var(--color-charcoal)] rounded-full overflow-hidden border border-[var(--color-border)]">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-[var(--color-terminal-green)]"
                    style={{ width: `${scannedItem.recyclability_score}%` }}
                  />
                </div>
              </div>
            )}

            {/* Toxic Materials */}
            {scannedItem.toxic_materials && scannedItem.toxic_materials.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertTriangle size={100} className="text-red-500" />
                </div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <AlertTriangle className="text-red-500" size={24} />
                  <h4 className="text-lg font-mono text-red-500 uppercase tracking-wider">
                    Toxic Materials
                  </h4>
                </div>
                <ul className="space-y-2 relative z-10">
                  {scannedItem.toxic_materials.map((material, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-red-400 font-mono text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disposal Steps */}
            {scannedItem.disposal_steps && scannedItem.disposal_steps.length > 0 && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <List className="text-[var(--color-text-secondary)]" size={24} />
                  <h4 className="text-lg font-mono text-[var(--color-text-primary)] uppercase tracking-wider">
                    Disposal Steps
                  </h4>
                </div>
                <ul className="space-y-3">
                  {scannedItem.disposal_steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-charcoal)] border border-[var(--color-border)] flex items-center justify-center font-mono text-xs text-[var(--color-terminal-green)]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Right Column - Projects */}
          <div>
            <div className="mb-8">
              <h3 className="text-lg font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Suggested Projects
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Select a project below to see the details
              </p>
            </div>

            {/* Project Grid */}
            <div className="grid gap-6 mb-8">
              {projects.map((project, index) => {
                const isSelected = index === selectedProjectIndex;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectIndex(index)}
                    className={`bg-[var(--color-surface)] border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${isSelected
                        ? 'border-[var(--color-terminal-green)] shadow-[0_0_30px_rgba(0,255,136,0.2)] scale-[1.02]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-terminal-green)]/50'
                      }`}
                  >
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[var(--color-charcoal)] border border-[var(--color-border)] flex items-center justify-center">
                        {project.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Title */}
                        <h4 className="text-2xl font-mono text-[var(--color-text-primary)] mb-4">
                          {project.title}
                        </h4>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 mb-4">
                          {/* Difficulty */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-[var(--color-text-secondary)] font-mono uppercase tracking-wider">
                                Difficulty
                              </span>
                              <span className="text-xs text-[var(--color-terminal-green)] font-mono">
                                {project.difficulty}
                              </span>
                            </div>
                            <div className="h-2 bg-[var(--color-charcoal)] rounded-full overflow-hidden border border-[var(--color-border)]">
                              <div
                                className="h-full bg-gradient-to-r from-[var(--color-terminal-green)] to-[var(--color-electric-blue)] transition-all duration-500"
                                style={{ width: `${project.difficultyLevel}%` }}
                              />
                            </div>
                          </div>

                          {/* Cost */}
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-charcoal)]/50 border border-[var(--color-border)]">
                            <DollarSign size={18} className="text-[var(--color-terminal-green)]" />
                            <span className="text-sm font-mono text-[var(--color-text-primary)] whitespace-nowrap">
                              {project.cost}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Button */}
            <button
              onClick={() => onOpenGuide(selectedProject.title)}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[var(--color-terminal-green)] to-[var(--color-electric-blue)] text-[var(--color-dark-bg)] font-mono text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition-all duration-300"
            >
              Generate Step-by-Step Guide 🛠️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}