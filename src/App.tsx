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
  recyclability_score?: number;
  toxic_materials?: string[];
  disposal_steps?: string[];
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'results'>('home');
  const [scannedItem, setScannedItem] = useState<ScanData | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (image: string, info: string) => {
    setIsScanning(true);
    try {
      const response = await fetch('http://localhost:5000/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, additional_info: info })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      
      const newScan: ScanData = {
        id: Date.now().toString(),
        name: data.device_type || 'Unknown Device',
        model: data.model || '',
        year: data.release_year || 'Unknown',
        image: image,
        status: 'Identified',
        recyclability_score: data.recyclability_score,
        toxic_materials: data.toxic_materials || [],
        disposal_steps: data.nearest_disposal_steps || []
      };

      setScannedItem(newScan);
      setCurrentScreen('results');
    } catch (error) {
      console.error('Scan failed:', error);
      alert('Failed to analyze image. Please ensure the backend is running.');
    } finally {
      setIsScanning(false);
    }
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
      {currentScreen === 'home' && (
        <HomeScreen 
          onScan={handleScan} 
          isScanning={isScanning}
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
        />
      )}
    </div>
  );
}
