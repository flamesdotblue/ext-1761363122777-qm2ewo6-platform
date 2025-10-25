import { useState } from 'react';
import HeroScene from './components/HeroScene';
import GameUI from './components/GameUI';
import GarageSelector from './components/GarageSelector';
import EnvironmentSelector from './components/EnvironmentSelector';

export default function App() {
  const [selectedCar, setSelectedCar] = useState('Porsche');
  const [selectedEnv, setSelectedEnv] = useState('Modern City');
  const [showGarage, setShowGarage] = useState(false);
  const [showEnvSelector, setShowEnvSelector] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      <HeroScene environment={selectedEnv} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

      <div className="absolute inset-0 flex flex-col">
        <header className="z-20 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <span className="text-lg">🏁</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Realistic Drive India</h1>
              <p className="text-xs md:text-sm text-white/70">Created by Manmohan | Instagram @manxpaa</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setShowEnvSelector(true)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition">Environments</button>
            <button onClick={() => setShowGarage(true)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition">Garage</button>
          </div>
        </header>

        <main className="z-10 flex-1 relative">
          <GameUI
            selectedCar={selectedCar}
            selectedEnv={selectedEnv}
            onOpenGarage={() => setShowGarage(true)}
            onOpenEnv={() => setShowEnvSelector(true)}
          />
        </main>

        <footer className="z-20 p-3 text-[11px] text-white/70 text-center">
          Created by Manmohan | Instagram @manxpaa
        </footer>
      </div>

      {showGarage && (
        <GarageSelector
          selectedCar={selectedCar}
          onSelect={(c) => { setSelectedCar(c); setShowGarage(false); }}
          onClose={() => setShowGarage(false)}
        />
      )}

      {showEnvSelector && (
        <EnvironmentSelector
          selectedEnv={selectedEnv}
          onSelect={(e) => { setSelectedEnv(e); setShowEnvSelector(false); }}
          onClose={() => setShowEnvSelector(false)}
        />
      )}
    </div>
  );
}
