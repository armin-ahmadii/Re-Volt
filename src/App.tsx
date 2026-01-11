import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { StepGuideModal } from './components/StepGuideModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { OnboardingScreen, UserProfile } from './components/OnboardingScreen';
import { GeminiService, ScanData } from './services/gemini';
import { Toaster, toast } from 'sonner';

// Adapt ScanData to match what ResultsScreen expects if needed, 
// or update ResultsScreen to match GeminiService's AnalysisResult.
// For now, let's assume they are compatible or we map them.
// The GeminiService returns AnalysisResult which has 'projects'.
// The original App.tsx had ScanData. Let's unify.

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'results'>('home'); // Default to home, will check profile in useEffect
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [scannedItem, setScannedItem] = useState<ScanData | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedKey = localStorage.getItem('gemini_api_key');
    const storedProfile = localStorage.getItem('user_profile');

    if (storedKey) {
      setApiKey(storedKey);
    } else if (envKey) {
      setApiKey(envKey);
    }

    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
      setCurrentScreen('home');
    } else {
      setCurrentScreen('onboarding');
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    toast.success('API Key saved successfully');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setCurrentScreen('home');
  };

  const handleScan = async (image: string, info: string) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API Key in settings first');
      setShowSettings(true);
      return;
    }

    // Step 1: Identify Hardware (Fast)
    setIsAnalyzing(true);
    const toastId = toast.loading('Identifying hardware...');

    try {
      const geminiService = new GeminiService(apiKey);

      // Fast identification
      const hardwareResult = await geminiService.identifyHardware(image, info);

      const scanData: ScanData = {
        ...hardwareResult,
        id: Date.now().toString(),
        image: image,
        projects: [] // Start empty
      };

      setScannedItem(scanData);
      setCurrentScreen('results'); // Navigate immediately
      toast.dismiss(toastId);
      toast.success('Hardware Identified!');
      setIsAnalyzing(false);

      // Step 2: Load initial projects in background
      setIsLoadingProjects(true);

      // Fetch 1 of each difficulty for the start
      const projects = await geminiService.suggestProjects(
        hardwareResult.name,
        hardwareResult.model,
        userProfile || undefined,
        undefined, // No specific difficulty means mixed bag
        3
      );

      setScannedItem(prev => prev ? { ...prev, projects: projects } : null); // Update with projects
      setIsLoadingProjects(false);

    } catch (error: any) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(error.message || 'Failed to analyze image. Please check your API key.');
      setIsAnalyzing(false);
    }
  };

  const handleLoadMore = async (difficulty: string) => {
    if (!scannedItem || !apiKey) return;

    setIsLoadingProjects(true);
    const geminiService = new GeminiService(apiKey);

    try {
      const newProjects = await geminiService.suggestProjects(
        scannedItem.name,
        scannedItem.model,
        userProfile || undefined,
        difficulty,
        3 // Load 3 more of that difficulty
      );

      setScannedItem(prev => {
        if (!prev) return null;
        return {
          ...prev,
          projects: [...prev.projects, ...newProjects]
        };
      });
    } catch (error) {
      toast.error("Failed to load more projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setScannedItem(null);
  };

  const handleOpenGuide = (projectName: string) => {
    setSelectedProject(projectName);
    setShowGuide(true);
  };

  const handleCloseGuide = () => {
    setShowGuide(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)]">
      <Toaster theme="dark" position="top-center" />

      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onScan={handleScan}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {currentScreen === 'results' && scannedItem && (
        <ResultsScreen
          scannedItem={scannedItem}
          onBack={handleBack}
          onOpenGuide={handleOpenGuide}
          userProfile={userProfile}
          isLoadingProjects={isLoadingProjects}
          onLoadMore={handleLoadMore}
        />
      )}

      {showGuide && (
        <StepGuideModal
          projectName={selectedProject}
          onClose={handleCloseGuide}
          // We might need to pass the full project data here if StepGuideModal 
          // doesn't have it. For now, assuming it might need refactoring 
          // or we pass the project object.
          // Let's assume StepGuideModal can find the project in scannedItem
          // or we pass the project details directly.
          // For this iteration, I'll pass the project object if I can find it.
          project={scannedItem?.projects.find((p: any) => p.title === selectedProject)}
        />
      )}

      <ApiKeyModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveApiKey}
        onReset={() => {
          localStorage.removeItem('user_profile');
          setUserProfile(null);
          setCurrentScreen('onboarding');
          toast.success('App reset successfully');
        }}
        initialKey={apiKey}
      />
    </div>
  );
}
