import { Camera, CheckCircle, Upload } from 'lucide-react';
import { useState } from 'react';

type HomeScreenProps = {
  onScan: () => void;
};

type RecentScan = {
  id: string;
  image: string;
  name: string;
  status: string;
};

export function HomeScreen({ onScan }: HomeScreenProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const recentScans: RecentScan[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1591238372408-8b98667c0460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBjb21wdXRlciUyMGhhcmR3YXJlfGVufDF8fHx8MTc2ODA4MzUwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Old PC',
      status: 'Project Found!'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1716072912080-0550a8945c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcm91dGVyJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzY4MDgzNTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Router',
      status: 'Salvageable'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1592509314528-afd0c8241a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWVib3klMjBoYW5kaGVsZHxlbnwxfHx8fDE3NjgwODM1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      name: 'Gameboy',
      status: 'Project Found!'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen animate-[fade-in_0.5s_ease-out]">
      {/* Header */}
      <header className="pt-16 pb-12 px-8 lg:px-16 max-w-7xl mx-auto w-full">
        <h1 className="text-5xl lg:text-6xl mb-3 text-[var(--color-terminal-green)]">
          TechCycle
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg tracking-wide">
          Identify. Repurpose. Revive.
        </p>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 px-8 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr,400px] gap-8 items-start">
          {/* Viewfinder Area */}
          <div className="flex flex-col gap-6">
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/10] rounded-2xl border border-[var(--color-border)] bg-[var(--color-charcoal)] overflow-hidden">
              {/* Uploaded Image or Scanning Grid */}
              {uploadedImage ? (
                <img 
                  src={uploadedImage} 
                  alt="Uploaded hardware" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
                  {/* Scanning Grid Overlay */}
                  <div className="absolute inset-0 scanning-grid">
                    {/* Vertical lines */}
                    <div className="absolute inset-0 grid grid-cols-8">
                      {[...Array(9)].map((_, i) => (
                        <div 
                          key={`v-${i}`}
                          className="border-r border-[var(--color-terminal-green)] opacity-20"
                        />
                      ))}
                    </div>
                    {/* Horizontal lines */}
                    <div className="absolute inset-0 grid grid-rows-5">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={`h-${i}`}
                          className="border-b border-[var(--color-terminal-green)] opacity-20"
                        />
                      ))}
                    </div>
                    {/* Animated scan line */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-terminal-green)] to-transparent animate-[scan-line_2s_ease-in-out_infinite]" />
                  </div>

                  {/* Crosshairs */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-terminal-green)] opacity-60" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-terminal-green)] opacity-60" />
                      <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full border-2 border-[var(--color-terminal-green)] animate-[pulse-glow_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </>
              )}

              {/* Corner brackets */}
              <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[var(--color-terminal-green)]" />
              <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[var(--color-terminal-green)]" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[var(--color-terminal-green)]" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[var(--color-terminal-green)]" />

              {/* Info overlay */}
              {!uploadedImage && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="bg-[var(--color-dark-bg)]/80 backdrop-blur-sm px-8 py-6 rounded-2xl border border-[var(--color-border)] text-center max-w-md">
                    <Upload size={48} className="text-[var(--color-terminal-green)] mx-auto mb-4 opacity-60" />
                    <p className="text-lg text-[var(--color-text-primary)] mb-2">
                      Ready to identify your hardware?
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Upload a photo to discover amazing repurposing projects
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info Input */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
              <label htmlFor="additionalInfo" className="block text-sm font-mono text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
                Serial Number / Additional Info
              </label>
              <input
                id="additionalInfo"
                type="text"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-charcoal)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono text-sm focus:border-[var(--color-terminal-green)] focus:outline-none transition-colors placeholder:text-[var(--color-text-secondary)]/50"
                placeholder="e.g., SN: ABC123456 or Model info..."
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upload Button */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-full h-16 rounded-2xl bg-[var(--color-terminal-green)] text-[var(--color-dark-bg)] font-mono uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[var(--color-electric-blue)] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] cursor-pointer">
                <Upload size={24} />
                Upload Image
              </div>
            </label>

            {/* Scan Button */}
            <button
              onClick={onScan}
              disabled={!uploadedImage}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[var(--color-terminal-green)] to-[var(--color-electric-blue)] text-[var(--color-dark-bg)] font-mono uppercase tracking-wider flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Camera size={24} />
              Analyze Hardware
            </button>

            {/* Recent Scans */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
              <h3 className="text-sm font-mono text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">
                Recent Scans
              </h3>
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div 
                    key={scan.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-charcoal)] border border-[var(--color-border)] hover:border-[var(--color-terminal-green)] transition-colors cursor-pointer group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--color-border)] flex-shrink-0">
                      <img 
                        src={scan.image} 
                        alt={scan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] mb-1 truncate">
                        {scan.name}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-terminal-green)]/20 text-[var(--color-terminal-green)] inline-block font-mono">
                        {scan.status}
                      </span>
                    </div>
                    <CheckCircle 
                      size={18} 
                      className="text-[var(--color-terminal-green)] fill-[var(--color-terminal-green)] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}