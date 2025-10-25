import { motion, AnimatePresence } from 'framer-motion';

const ENVS = [
  { name: 'Modern City', emoji: '🏙️', desc: 'Tall buildings, traffic, neon reflections' },
  { name: 'Indian Village', emoji: '🌾', desc: 'Trees, huts, cows along the road' },
  { name: 'Highway', emoji: '🛣️', desc: 'Barriers, trucks, long stretches' },
  { name: 'Market Area', emoji: '🛍️', desc: 'People walking, local markets' },
];

const WEATHERS = [
  { name: 'Sunny', emoji: '☀️' },
  { name: 'Cloudy', emoji: '☁️' },
  { name: 'Rainy', emoji: '🌧️' },
];

export default function EnvironmentSelector({ selectedEnv, onSelect, onClose }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-2xl font-semibold">Choose Environment</h3>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Back</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENVS.map((env) => (
              <button
                key={env.name}
                onClick={() => onSelect(env.name)}
                className={`group rounded-xl border p-4 text-left transition backdrop-blur-md ${selectedEnv === env.name ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="h-28 w-full rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-4xl">
                  <span>{env.emoji}</span>
                </div>
                <p className="mt-3 font-semibold">{env.name}</p>
                <p className="text-xs text-white/60">{env.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm text-white/70 mb-2">Weather & Time</p>
            <div className="flex flex-wrap items-center gap-2">
              {WEATHERS.map((w) => (
                <span key={w.name} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">{w.emoji} {w.name}</span>
              ))}
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">🌅 Day</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">🌃 Night</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Confirm</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
