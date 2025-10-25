import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MODES = ['Endless Drive', 'Timed Challenge'];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function GameUI({ selectedCar, selectedEnv, onOpenGarage, onOpenEnv }) {
  const [mode, setMode] = useState('Endless Drive');
  const [camera, setCamera] = useState('Third-person');
  const [status, setStatus] = useState('menu'); // menu | playing | paused | gameover
  const [score, setScore] = useState(0);
  const [highest, setHighest] = useState(() => {
    const v = localStorage.getItem('highestScore');
    return v ? parseInt(v) : 0;
  });
  const [speed, setSpeed] = useState(60); // km/h like feel
  const [duration, setDuration] = useState(60); // for Timed Challenge
  const [mobileInputs, setMobileInputs] = useState({ left: false, right: false, accel: false, brake: false, nitro: false });
  const timerRef = useRef(null);

  const canPlay = useMemo(() => status === 'playing', [status]);

  useEffect(() => {
    function onKey(e) {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === 'c') setCamera((c) => (c === 'Third-person' ? 'Cockpit' : 'Third-person'));
      if (k === ' ') setMobileInputs((i) => ({ ...i, nitro: true }));
      if (k === 'arrowleft') setMobileInputs((i) => ({ ...i, left: true }));
      if (k === 'arrowright') setMobileInputs((i) => ({ ...i, right: true }));
      if (k === 'w') setMobileInputs((i) => ({ ...i, accel: true }));
      if (k === 's') setMobileInputs((i) => ({ ...i, brake: true }));
    }
    function onKeyUp(e) {
      const k = e.key.toLowerCase();
      if (k === ' ') setMobileInputs((i) => ({ ...i, nitro: false }));
      if (k === 'arrowleft') setMobileInputs((i) => ({ ...i, left: false }));
      if (k === 'arrowright') setMobileInputs((i) => ({ ...i, right: false }));
      if (k === 'w') setMobileInputs((i) => ({ ...i, accel: false }));
      if (k === 's') setMobileInputs((i) => ({ ...i, brake: false }));
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (status !== 'playing') return;
    const start = performance.now();
    timerRef.current = requestAnimationFrame(function loop(ts) {
      const elapsed = (ts - start) / 1000;
      setScore((s) => Math.floor(s + 1));
      // In a real game, score can be distance-based too (per 10 meters).
      timerRef.current = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(timerRef.current);
  }, [status]);

  useEffect(() => {
    if (status !== 'playing' || mode !== 'Timed Challenge') return;
    const interval = setInterval(() => {
      setDuration((d) => {
        if (d <= 1) {
          clearInterval(interval);
          onCrash();
          return 0;
        }
        return d - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, mode]);

  function startGame() {
    setScore(0);
    if (mode === 'Timed Challenge') setDuration(60);
    setStatus('playing');
  }
  function pauseGame() {
    setStatus('paused');
  }
  function resumeGame() {
    setStatus('playing');
  }
  function backToMenu() {
    setStatus('menu');
    setScore(0);
  }
  function onCrash() {
    setStatus('gameover');
    setHighest((h) => {
      const nh = Math.max(h, score);
      localStorage.setItem('highestScore', String(nh));
      return nh;
    });
  }
  function restart() {
    setScore(0);
    if (mode === 'Timed Challenge') setDuration(60);
    setStatus('playing');
  }
  function exitGame() {
    // In web, attempt to close or go to menu
    if (window && window.close) window.close();
    setStatus('menu');
  }

  const speedDisplay = Math.round(speed + (mobileInputs.nitro ? 40 : 0));

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Top HUD */}
      <div className="pointer-events-none absolute top-3 left-0 right-0 z-20 flex items-center justify-center">
        {status === 'playing' && (
          <div className="px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-sm flex items-center gap-6">
            <span>Mode: {mode}</span>
            <span>Camera: {camera} (Press C)</span>
            <span>Car: {selectedCar}</span>
            <span>Env: {selectedEnv}</span>
            <span>Speed: {speedDisplay} km/h</span>
            <span>Score: {score}</span>
            {mode === 'Timed Challenge' && <span>Time Left: {formatTime(duration)}</span>}
          </div>
        )}
      </div>

      {/* Pause button */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {status === 'playing' && (
          <button onClick={pauseGame} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md">Pause</button>
        )}
        {(status === 'paused' || status === 'menu') && (
          <button onClick={startGame} className="px-3 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-500 border border-white/10 backdrop-blur-md">Start</button>
        )}
      </div>

      {/* Center Menu */}
      {status === 'menu' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h2 className="text-2xl md:text-4xl font-semibold">Realistic Drive India</h2>
            <p className="text-sm md:text-base text-white/70 mt-1">High-speed 3D racing and survival. Avoid traffic, chase high scores.</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60">Game Mode</p>
                <div className="mt-2 flex gap-2">
                  {MODES.map((m) => (
                    <button key={m} onClick={() => setMode(m)} className={`px-3 py-2 rounded-lg border ${mode === m ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{m}</button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-sm text-white/60">Speed Control</label>
                  <input type="range" min={20} max={200} value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={onOpenGarage} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Choose Car</button>
                  <button onClick={onOpenEnv} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Choose Environment</button>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60">Controls</p>
                <ul className="mt-2 text-sm space-y-1 text-white/80">
                  <li>PC: ← → steer, W accelerate, S brake, Space nitro, C camera</li>
                  <li>Mobile: on-screen buttons provided</li>
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/10 text-sm">
                  Highest Score: <span className="font-semibold">{highest}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={startGame} className="px-4 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-500">Start Game</button>
                  <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Splash</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paused overlay */}
      <AnimatePresence>
        {status === 'paused' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <h3 className="text-2xl font-semibold">Paused</h3>
              <p className="text-white/70 mt-2">Take a breather. Watch traffic.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button onClick={resumeGame} className="px-4 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-500">Resume</button>
                <button onClick={restart} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Restart</button>
                <button onClick={backToMenu} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Back to Menu</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over overlay */}
      <AnimatePresence>
        {status === 'gameover' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-4xl mb-2">💥</div>
              <h3 className="text-2xl font-semibold">You Crashed! – Game Over</h3>
              <p className="mt-2 text-white/70">Score: <span className="font-semibold text-white">{score}</span> | Highest: <span className="font-semibold text-white">{highest}</span></p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={restart} className="px-4 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-500">Restart</button>
                <button onClick={backToMenu} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Main Menu</button>
                <button onClick={exitGame} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Exit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playfield overlay with mock controls */}
      {status === 'playing' && (
        <div className="absolute inset-0 z-10">
          <div className="absolute bottom-20 left-4 right-4 flex items-end justify-between">
            {/* Mobile steer */}
            <div className="flex gap-3">
              <TapButton label="←" active={mobileInputs.left} onPress={(v) => setMobileInputs((i) => ({ ...i, left: v }))} />
              <TapButton label="→" active={mobileInputs.right} onPress={(v) => setMobileInputs((i) => ({ ...i, right: v }))} />
            </div>
            {/* Mobile accel/brake/nitro */}
            <div className="flex gap-3">
              <TapButton label="Brake" active={mobileInputs.brake} onPress={(v) => setMobileInputs((i) => ({ ...i, brake: v }))} />
              <TapButton label="Accel" active={mobileInputs.accel} onPress={(v) => setMobileInputs((i) => ({ ...i, accel: v }))} />
              <TapButton label="Nitro" active={mobileInputs.nitro} onPress={(v) => setMobileInputs((i) => ({ ...i, nitro: v }))} />
            </div>
          </div>

          {/* Simulate Crash for demo */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button onClick={onCrash} className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 border border-white/10">Simulate Crash</button>
          </div>
        </div>
      )}

      {/* Watermark */}
      <div className="absolute bottom-2 right-2 z-20 text-[11px] text-white/70">
        Created by Manmohan | Instagram @manxpaa
      </div>
    </div>
  );
}

function TapButton({ label, active, onPress }) {
  return (
    <button
      onMouseDown={() => onPress(true)}
      onMouseUp={() => onPress(false)}
      onMouseLeave={() => onPress(false)}
      onTouchStart={() => onPress(true)}
      onTouchEnd={() => onPress(false)}
      className={`min-w-[72px] px-4 py-3 rounded-xl border backdrop-blur-md text-sm ${active ? 'bg-emerald-500/30 border-emerald-400/50' : 'bg-white/10 border-white/10'}`}
    >
      {label}
    </button>
  );
}
