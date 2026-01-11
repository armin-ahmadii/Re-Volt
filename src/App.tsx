import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { StepGuideModal } from './components/StepGuideModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GeminiService, ScanData } from './services/gemini';
import { Toaster, toast } from 'sonner';

// Adapt ScanData to match what ResultsScreen expects if needed, 
// or update ResultsScreen to match GeminiService's AnalysisResult.
// For now, let's assume they are compatible or we map them.
// The GeminiService returns AnalysisResult which has 'projects'.
// The original App.tsx had ScanData. Let's unify.

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'results'>('home');
  const [scannedItem, setScannedItem] = useState<ScanData | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedKey = localStorage.getItem('gemini_api_key');

    if (envKey) {
      setApiKey(envKey);
    } else if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    toast.success('API Key saved successfully');
  };

  const handleScan = async (image: string, info: string) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API Key in settings first');
      setShowSettings(true);
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading('Analyzing hardware...');

    try {
      const geminiService = new GeminiService(apiKey);
      const result = await geminiService.analyzeImage(image, info);

      // Map result to ScanData if necessary, but AnalysisResult looks compatible
      // with what we want to display.
      // We might need to ensure IDs are added if ResultsScreen needs them.
      const scanDataWithId = {
        ...result,
        id: Date.now().toString(),
        image: image
      };

      setScannedItem(scanDataWithId);
      setCurrentScreen('results');
      toast.dismiss(toastId);
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error(error);
      toast.dismiss(toastId);
      // Use the actual error message which might be quota related
      toast.error(error.message || 'Failed to analyze image. Please check your API key.');
    } finally {
      setIsAnalyzing(false);
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
        initialKey={apiKey}
      />
    </div>
  );
}
