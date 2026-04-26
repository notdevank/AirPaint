import React from 'react';
import { motion } from 'framer-motion';
import { Target, Radio, Cpu } from 'lucide-react';
import type { GestureState } from '../hooks/useGestures';

interface DroneProps {
  gesture: GestureState;
}

const Drone: React.FC<DroneProps> = ({ gesture }) => {
  const isPinching = gesture.type === 'pinch';
  
  return (
    <motion.div
      className="fixed pointer-events-none z-[80]"
      animate={{
        x: gesture.x * window.innerWidth,
        y: gesture.y * window.innerHeight,
        rotate: (gesture.x - 0.5) * 45, 
      }}
      transition={{ 
        type: 'spring', 
        damping: 25, 
        stiffness: 150, 
        mass: 0.8 
      }}
      style={{ translateX: '-50%', translateY: '-120%' }}
    >
      <div className="relative">
        <motion.div
          animate={{
            opacity: isPinching ? 0.6 : 0,
            height: isPinching ? 200 : 0,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-primary to-transparent origin-top"
        />

        <div className="w-16 h-8 bg-slate-900 border border-white/20 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <Target size={14} className="text-primary animate-pulse" />
          
          <div className={`absolute top-1 right-4 w-1.5 h-1.5 rounded-full ${gesture.type !== 'none' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`} />
        </div>

        <div className="absolute -top-2 -left-4 flex gap-12 w-full justify-center">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
              className="w-8 h-1 bg-white/30 rounded-full"
            />
          ))}
        </div>

        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: gesture.type !== 'none' ? 1 : 0 }}
          className="absolute -right-24 top-0 flex flex-col gap-1"
        >
          <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded flex items-center gap-2">
            <Radio size={8} className="text-primary" />
            <span className="text-[7px] font-mono text-white/80 uppercase">Sig: Stable</span>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded flex items-center gap-2">
            <Cpu size={8} className="text-primary" />
            <span className="text-[7px] font-mono text-white/80 uppercase">Proc: {gesture.type}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Drone;
