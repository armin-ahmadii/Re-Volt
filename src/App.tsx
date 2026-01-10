import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { StepGuideModal } from './components/StepGuideModal';

export type ScanData = {
  id: string;
  name: string;
  model: string;
  year: string;
  image: string;
  status?: string;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'results'>('home');
  const [scannedItem, setScannedItem] = useState<ScanData | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const handleScan = () => {
    // Simulate scanning a Dell Optiplex
    const mockScan: ScanData = {
      id: '1',
      name: 'Dell Optiplex',
      model: 'Optiplex 7010',
      year: '2012',
      image: 'https://images.unsplash.com/photo-1591238372408-8b98667c0460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBjb21wdXRlciUyMGhhcmR3YXJlfGVufDF8fHx8MTc2ODA4MzUwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'Identified'
    };
    setScannedItem(mockScan);
    setCurrentScreen('results');
  };

  const handleBack = () => {
    setCurrentScreen('home');
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
      {currentScreen === 'home' && <HomeScreen onScan={handleScan} />}
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
        />
      )}
    </div>
  );
}
