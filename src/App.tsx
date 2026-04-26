import React from 'react';
import HandTracker from './components/HandTracker';
import GestureCursor from './components/GestureCursor';
import AirPaint from './components/AirPaint';
import { useHandGestures } from './hooks/useGestures';

function App() {
  const { gesture, processResults } = useHandGestures();

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 text-white mesh-bg">
      <div className="scanline" />
      
      <HandTracker onResults={processResults} />
      <GestureCursor gesture={gesture} />
      
      {/* AirPaint Canvas Layer */}
      <AirPaint gesture={gesture} />

      {/* Global Status HUD */}
      <div className="fixed top-8 right-8 flex gap-4 pointer-events-none">
        <div className="glass px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase opacity-40">
          Neural-Link: Stable
        </div>
        <div className="glass px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase text-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          Mode: Spatial Paint
        </div>
      </div>
    </div>
  );
}

export default App;
