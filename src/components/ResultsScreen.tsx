import { useState } from 'react';
import { ArrowLeft, CheckCircle, Shield, Server, Wrench, DollarSign, Cpu, Star, BookOpen, Search } from 'lucide-react';
import type { AnalysisResult, Project } from '../services/gemini';
import type { UserProfile } from './OnboardingScreen';

type ResultsScreenProps = {
  scannedItem: AnalysisResult & { image: string }; // App.tsx adds image to the result
  onBack: () => void;
  onOpenGuide: (projectName: string) => void;
  userProfile: UserProfile | null;
  isLoadingProjects: boolean;
  onLoadMore: (difficulty: string) => void;
};

export function ResultsScreen({ scannedItem, onBack, onOpenGuide, userProfile, isLoadingProjects, onLoadMore }: ResultsScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  // Filter projects by difficulty
  const projects = scannedItem.projects.filter(p =>
    p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  );

  const selectedProject = projects[selectedProjectIndex];

  // Helper to get an icon based on difficulty or title (random/hashed or simple logic)
  const getIcon = (project: Project) => {
    // Simple placeholder logic
    return <Cpu size={32} className="text-[var(--color-terminal-green)]" />;
  };

  const getDifficultyLevel = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'easy': return 30;
      case 'intermediate':
      case 'medium': return 60;
      case 'advanced':
      case 'hard': return 90;
      default: return 50;
    }
  };

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
          {/* Left Column - Identity Card */}
          <div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden sticky top-28">
              {/* Image */}
              <div className="relative h-80 bg-[var(--color-charcoal)]">
                <img
                  src={scannedItem.image}
                  alt={scannedItem.name}
                  className="w-full h-full object-cover"
                />
                {/* Identified Badge */}
                <div className="absolute top-6 right-6 bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] px-4 py-2 rounded-full flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                  <CheckCircle size={16} />
                  {scannedItem.status}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-3xl font-mono text-[var(--color-terminal-green)] mb-2">
                  {scannedItem.name}
                </h3>
                <p className="text-xl text-[var(--color-text-primary)] mb-1">
                  {scannedItem.model}
                </p>
                <p className="text-base text-[var(--color-text-secondary)] font-mono">
                  Year: {scannedItem.year}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Projects */}
          <div>
            <div className="mb-8">
              <h3 className="text-lg font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Suggested Projects
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Select a project below to see the details
              </p>

              {/* Difficulty Tabs */}
              <div className="flex gap-2 p-1 bg-[var(--color-charcoal)] rounded-xl border border-[var(--color-border)]">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setSelectedProjectIndex(0);
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-mono transition-all ${selectedDifficulty === diff
                      ? 'bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-bold shadow-lg'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid gap-6 mb-4">
              {projects.length === 0 && isLoadingProjects ? (
                // Skeleton Loader
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 h-48 animate-pulse">
                      <div className="flex gap-6">
                        <div className="w-20 h-20 bg-[var(--color-charcoal)] rounded-2xl"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-6 bg-[var(--color-charcoal)] rounded w-3/4"></div>
                          <div className="h-4 bg-[var(--color-charcoal)] rounded w-1/2"></div>
                          <div className="h-16 bg-[var(--color-charcoal)] rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center text-[var(--color-terminal-green)] font-mono animate-pulse mt-4">
                    Analyzing hardware possibilities...
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center opacity-50">
                    <Search size={32} className="text-[var(--color-text-secondary)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)] font-mono mb-4">No projects found for {selectedDifficulty} difficulty.</p>
                  <button
                    onClick={() => onLoadMore(selectedDifficulty)}
                    className="px-6 py-2 rounded-xl border border-[var(--color-terminal-green)] text-[var(--color-terminal-green)] font-mono text-sm hover:bg-[var(--color-terminal-green)]/10 transition-colors"
                  >
                    Try Loading Again
                  </button>
                </div>
              ) : (
                projects.map((project, index) => {
                  const isSelected = index === selectedProjectIndex;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedProjectIndex(index)}
                      className={`bg-[var(--color-surface)] border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${isSelected
                        ? 'border-[var(--color-terminal-green)] shadow-[0_0_30px_rgba(0,255,136,0.2)] scale-[1.02]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-terminal-green)]/50'
                        }`}
                    >
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[var(--color-charcoal)] border border-[var(--color-border)] flex items-center justify-center">
                          {getIcon(project)}
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
                                  style={{ width: `${getDifficultyLevel(project.difficulty)}%` }}
                                />
                              </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-charcoal)]/50 border border-[var(--color-border)]">
                              <span className="text-sm font-mono text-[var(--color-text-primary)] whitespace-nowrap">
                                {project.time}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-4">
                            {project.description}
                          </p>

                          {/* Personalization Info */}
                          {project.whySuggested && (
                            <div className="mb-4 p-3 rounded-lg bg-[var(--color-terminal-green)]/10 border border-[var(--color-terminal-green)]/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Star size={14} className="text-[var(--color-terminal-green)]" />
                                <span className="text-xs font-mono text-[var(--color-terminal-green)] uppercase tracking-wider">Why Suggested</span>
                              </div>
                              <p className="text-sm text-[var(--color-text-primary)]">{project.whySuggested}</p>
                            </div>
                          )}

                          {/* Skills Gained */}
                          {project.skillsGained && project.skillsGained.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.skillsGained.map((skill, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-[var(--color-charcoal)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-mono flex items-center gap-2">
                                  <BookOpen size={12} />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Recommended Tutorials */}
                          {project.tutorialVideos && project.tutorialVideos.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="text-[#FF0000]">▶</span> Recommended Tutorials
                              </h5>
                              <div className="flex flex-col gap-2">
                                {project.tutorialVideos.map((video, i) => {
                                  // Smart Redirect: Uses DuckDuckGo's !ducky to redirect to the first result on YouTube
                                  // This acts like a direct link but finds the video dynamically, avoiding broken URLs.
                                  const smartRedirectUrl = `https://duckduckgo.com/?q=!ducky+site:youtube.com+${encodeURIComponent(video.title + ' ' + video.channel)}`;

                                  return (
                                    <div key={i} className="flex items-center gap-2 group">
                                      <a
                                        href={smartRedirectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-terminal-green)] transition-colors flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()} // Prevent card click
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] group-hover:bg-[var(--color-terminal-green)] transition-colors" />
                                        <span>
                                          <span className="font-medium">{video.title}</span>
                                          <span className="text-[var(--color-text-secondary)] ml-1">by {video.channel}</span>
                                        </span>
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Load More Button */}
            {!isLoadingProjects && projects.length > 0 && (
              <button
                onClick={() => onLoadMore(selectedDifficulty)}
                className="w-full py-4 mb-6 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-mono uppercase tracking-wider hover:bg-[var(--color-surface)] hover:text-[var(--color-terminal-green)] hover:border-[var(--color-terminal-green)] transition-all flex items-center justify-center gap-2"
              >
                <Search size={16} />
                Load More {selectedDifficulty} Projects
              </button>
            )}

            {isLoadingProjects && projects.length > 0 && (
              <div className="w-full py-4 mb-6 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-mono uppercase tracking-wider bg-[var(--color-surface)] flex items-center justify-center gap-2 opacity-70 cursor-wait">
                <div className="w-4 h-4 border-2 border-[var(--color-terminal-green)] border-t-transparent rounded-full animate-spin"></div>
                Finding extra projects...
              </div>
            )}

            {/* Action Button */}
            {selectedProject && (
              <button
                onClick={() => onOpenGuide(selectedProject.title)}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-[var(--color-terminal-green)] to-[var(--color-electric-blue)] text-[var(--color-dark-bg)] font-mono text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition-all duration-300"
              >
                Generate Step-by-Step Guide 🛠️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}