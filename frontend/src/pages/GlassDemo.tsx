import React, { useState } from 'react';
import { FloatingWindow, useWindowManager } from '../components/ui/FloatingWindow';
import { 
  GlassPanel, 
  GlassButton, 
  GlassInput, 
  GlassCard,
  GlassModal 
} from '../components/ui/GlassPanel';
import { GlassCodeEditor, LanguageSelector } from '../components/ui/CodeEditor';
import { backgroundGradients } from '../styles/glass-theme';
import { Code, Terminal, Database, Settings, Zap, Palette } from 'lucide-react';

export default function GlassDemo(): JSX.Element {
  const [showEditor, setShowEditor] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState(`// Welcome to AetherOS Glass Morphism Demo
import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';

interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <GlassPanel gradient="rainbow">
      <h1>Hello, {name}! 👋</h1>
      <p>Welcome to the future of development environments.</p>
    </GlassPanel>
  );
};

export default Welcome;`);

  const { 
    windows, 
    createWindow, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow 
  } = useWindowManager();

  const handleCreateEditor = () => {
    createWindow('editor-' + Date.now(), 'Code Editor', {
      size: { width: 800, height: 600 }
    });
  };

  const handleCreateTerminal = () => {
    createWindow('terminal-' + Date.now(), 'Terminal', {
      size: { width: 600, height: 400 },
      position: { x: 200, y: 200 }
    });
  };

  return (
    <div className={`min-h-screen ${backgroundGradients.aurora} p-4`}>
      {/* Main Demo Panel */}
      <GlassPanel className="max-w-6xl mx-auto" gradient="rainbow">
        <div className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Palette className="w-10 h-10" />
              Glass Morphism Demo
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Experience the next-generation UI with glass morphism effects, floating windows, 
              and modern development tools that feel like magic.
            </p>
          </div>

          {/* Demo Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <GlassButton 
              variant="primary" 
              onClick={handleCreateEditor}
              className="flex items-center justify-center gap-2"
            >
              <Code className="w-4 h-4" />
              New Editor
            </GlassButton>
            
            <GlassButton 
              variant="secondary" 
              onClick={handleCreateTerminal}
              className="flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              New Terminal
            </GlassButton>
            
            <GlassButton 
              variant="success" 
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </GlassButton>
            
            <GlassButton 
              variant="danger" 
              onClick={() => {
                Object.keys(windows).forEach(id => closeWindow(id));
              }}
              className="flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Close All
            </GlassButton>
          </div>

          {/* Input Demo */}
          <div className="mb-8">
            <GlassInput
              value={inputValue}
              onChange={setInputValue}
              placeholder="Try typing in this glass input field..."
              icon={<Database className="w-4 h-4" />}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard
              title="Performance"
              subtitle="Lightning fast rendering"
              gradient="neon"
            >
              <div className="space-y-2">
                <div className="text-white/80">• Hardware-accelerated effects</div>
                <div className="text-white/80">• 60fps smooth animations</div>
                <div className="text-white/80">• Optimized for all devices</div>
              </div>
            </GlassCard>

            <GlassCard
              title="Modern Design"
              subtitle="Glass morphism aesthetics"
              gradient="warm"
            >
              <div className="space-y-2">
                <div className="text-white/80">• Backdrop blur effects</div>
                <div className="text-white/80">• Gradient overlays</div>
                <div className="text-white/80">• Responsive layouts</div>
              </div>
            </GlassCard>

            <GlassCard
              title="Developer Experience"
              subtitle="Built for productivity"
              gradient="dark"
            >
              <div className="space-y-2">
                <div className="text-white/80">• TypeScript support</div>
                <div className="text-white/80">• Hot reload</div>
                <div className="text-white/80">• Component library</div>
              </div>
            </GlassCard>
          </div>

          {/* Code Editor Demo */}
          <div className="mb-8">
            <GlassCodeEditor
              title="Live Code Editor"
              value={code}
              onChange={(value) => setCode(value || '')}
              language={language}
              height="300px"
              actions={
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                />
              }
              footer={
                <div className="flex items-center justify-between text-white/70 text-sm">
                  <span>Lines: {code.split('\n').length}</span>
                  <span>Characters: {code.length}</span>
                </div>
              }
            />
          </div>
        </div>
      </GlassPanel>

      {/* Floating Windows */}
      {Object.values(windows).map((window) => (
        <FloatingWindow
          key={window.id}
          id={window.id}
          title={window.title}
          icon={window.title.includes('Editor') ? Code : Terminal}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
        >
          {window.title.includes('Editor') ? (
            <GlassCodeEditor
              value={code}
              onChange={(value) => setCode(value || '')}
              language={language}
              height="100%"
              className="h-full border-0 rounded-none"
            />
          ) : (
            <div className="p-4 h-full bg-black/20 font-mono text-sm text-green-400">
              <div className="mb-2">$ npm run dev</div>
              <div className="mb-2">Starting development server...</div>
              <div className="mb-2 text-cyan-400">✓ Ready on http://localhost:5680</div>
              <div className="mb-2">✓ TypeScript compilation complete</div>
              <div className="mb-2">✓ Hot reload enabled</div>
              <div className="mb-4">✓ Glass morphism loaded</div>
              
              <div className="flex items-center">
                <span className="text-green-400 mr-2">➜</span>
                <span className="text-white">~/aetheros</span>
                <span className="text-blue-400 ml-2">git:(main)</span>
                <span className="animate-pulse ml-1">_</span>
              </div>
            </div>
          )}
        </FloatingWindow>
      ))}

      {/* Settings Modal */}
      <GlassModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Glass Morphism Settings"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Theme Selection
            </label>
            <select className="w-full bg-white/10 border border-white/20 backdrop-blur-md text-white px-3 py-2 rounded-lg">
              <option value="aurora">Aurora</option>
              <option value="cosmic">Cosmic</option>
              <option value="ocean">Ocean</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Blur Intensity
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Glass Opacity
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="15"
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <GlassButton variant="primary" className="flex-1">
              Apply Settings
            </GlassButton>
            <GlassButton 
              variant="secondary" 
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Floating Status Bar */}
      <div className="fixed bottom-4 right-4">
        <GlassPanel className="p-3" gradient="dark">
          <div className="text-white/80 text-sm flex items-center gap-4">
            <span>Windows: {Object.keys(windows).length}</span>
            <span>FPS: 60</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Online
            </span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}