import { useState } from 'react';
import { ArrowRight, Upload, User, Briefcase, GraduationCap, FileText, Sparkles } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { toast } from 'sonner';

export type UserProfile = {
    occupation: string;
    year?: string;
    resumeText: string;
    skills: string[];
};

type OnboardingScreenProps = {
    onComplete: (profile: UserProfile) => void;
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [occupation, setOccupation] = useState('');
    const [year, setYear] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleNext = () => {
        if (!occupation) {
            toast.error('Please enter your occupation');
            return;
        }
        if (occupation.toLowerCase() === 'student' && !year) {
            toast.error('Please enter your year');
            return;
        }
        setStep(2);
    };

    const handleAnalyze = async () => {
        if (!resumeText) {
            toast.error('Please paste your resume or list your skills');
            return;
        }

        setIsAnalyzing(true);
        const toastId = toast.loading('Analyzing your profile...');

        try {
            // We'll use a simple heuristic or a quick Gemini call here if we had the key ready.
            // For now, let's just extract skills from the text or pass the raw text.
            // Ideally, we'd use Gemini to extract structured skills.
            // Let's assume we pass the raw text to the main analysis later.

            // Simulating analysis delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const profile: UserProfile = {
                occupation,
                year: occupation.toLowerCase() === 'student' ? year : undefined,
                resumeText,
                skills: [] // We'll let the main analysis extract skills for now
            };

            toast.dismiss(toastId);
            toast.success('Profile created!');
            onComplete(profile);
        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error('Failed to analyze profile');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,255,136,0.1)] animate-[scale-in_0.4s_ease-out]">

                {/* Header */}
                <div className="bg-[var(--color-charcoal)]/50 border-b border-[var(--color-border)] px-8 py-6">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-terminal-green)]/10 flex items-center justify-center border border-[var(--color-terminal-green)]/20">
                            <User className="text-[var(--color-terminal-green)]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-mono text-[var(--color-text-primary)]">Welcome to Re-Volt</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">Let's personalize your experience</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
                            <div className="space-y-2">
                                <label className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                    <Briefcase size={16} />
                                    Occupation
                                </label>
                                <input
                                    type="text"
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    placeholder="e.g. Student, Software Engineer, Hobbyist"
                                    className="w-full bg-[var(--color-dark-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-terminal-green)] focus:outline-none transition-colors"
                                />
                            </div>

                            {occupation.toLowerCase() === 'student' && (
                                <div className="space-y-2 animate-[fade-in_0.3s_ease-out]">
                                    <label className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                        <GraduationCap size={16} />
                                        Year / Grade
                                    </label>
                                    <input
                                        type="text"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="e.g. Sophomore, Senior, 10th Grade"
                                        className="w-full bg-[var(--color-dark-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-terminal-green)] focus:outline-none transition-colors"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleNext}
                                className="w-full mt-4 py-4 rounded-xl bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-mono font-bold text-lg hover:bg-[var(--color-terminal-green)]/90 transition-colors flex items-center justify-center gap-2 group"
                            >
                                Next Step
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
                            <div className="space-y-2">
                                <label className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={16} />
                                    Resume / Skills
                                </label>
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    Paste your resume or list skills you want to develop. We'll use this to suggest relevant projects.
                                </p>
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    className="w-full h-48 bg-[var(--color-dark-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-terminal-green)] focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full mt-4 py-4 rounded-xl bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-mono font-bold text-lg hover:bg-[var(--color-terminal-green)]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[var(--color-dark-bg)] border-t-transparent rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Complete Profile
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                className="w-full py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm"
                            >
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
