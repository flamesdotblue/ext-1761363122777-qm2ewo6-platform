import Spline from '@splinetool/react-spline';
import { useMemo } from 'react';

export default function HeroScene({ environment }) {
  const gradient = useMemo(() => {
    switch (environment) {
      case 'Modern City':
        return 'from-slate-900 via-neutral-900 to-black';
      case 'Indian Village':
        return 'from-emerald-900 via-stone-900 to-black';
      case 'Highway':
        return 'from-zinc-900 via-zinc-950 to-black';
      case 'Market Area':
        return 'from-amber-900 via-stone-900 to-black';
      default:
        return 'from-neutral-900 via-black to-black';
    }
  }, [environment]);

  return (
    <div className={`absolute inset-0`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-40`} />
      <Spline style={{ width: '100%', height: '100%' }} scene="https://prod.spline.design/m8wpIQzXWhEh9Yek/scene.splinecode" />
    </div>
  );
}
