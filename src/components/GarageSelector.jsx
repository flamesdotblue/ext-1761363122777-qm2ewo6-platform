import { motion, AnimatePresence } from 'framer-motion';

const CARS = [
  'Porsche',
  'BMW',
  'G-Wagon',
  'Supra',
  'Bolero',
  'Mahindra Marshal',
];

export default function GarageSelector({ selectedCar, onSelect, onClose }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-2xl font-semibold">Garage</h3>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Back</button>
            </div>
          </div>

          <p className="text-sm text-white/70 mb-4">Choose your car. Each car sits on a rotating platform under soft lighting.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CARS.map((car) => (
              <button
                key={car}
                onClick={() => onSelect(car)}
                className={`group relative overflow-hidden rounded-xl border backdrop-blur-md p-4 text-left transition ${selectedCar === car ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="h-36 w-full rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-5xl">🚗</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold">{car}</p>
                    <p className="text-xs text-white/60">Tap to select</p>
                  </div>
                  {selectedCar === car && <span className="text-emerald-400 text-sm">Selected</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">Select Car</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
