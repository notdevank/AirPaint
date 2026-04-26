import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GestureState } from '../hooks/useGestures';

interface GestureCursorProps {
  gesture: GestureState;
}

const GestureCursor: React.FC<GestureCursorProps> = ({ gesture }) => {
  const isActive = gesture.type !== 'none';
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <motion.div
        animate={{
          x: gesture.x * window.innerWidth,
          y: gesture.y * window.innerHeight,
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.5,
        }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 400, 
          mass: 0.5,
          opacity: { duration: 0.2 }
        }}
        className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            scale: gesture.isClicking ? 0.8 : gesture.type === 'pinch' ? 0.6 : 1,
            backgroundColor: gesture.isClicking ? '#FFFFFF' : '#00E5FF',
          }}
          className="w-4 h-4 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.8)]"
        />

        <motion.div
          animate={{
            scale: gesture.type === 'pinch' ? 1.5 : 2,
            rotate: gesture.type === 'pinch' ? 180 : 0,
            borderColor: gesture.type === 'pinch' ? '#7000FF' : '#00E5FF',
            opacity: gesture.type === 'point' ? 1 : 0.4
          }}
          className="absolute w-12 h-12 rounded-full border-2 border-dashed opacity-50"
        />

        <AnimatePresence>
          {gesture.isClicking && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute w-4 h-4 rounded-full bg-white"
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isActive ? 1 : 0, x: 30 }}
          className="absolute whitespace-nowrap"
        >
          <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 shadow-2xl">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">
              {gesture.type === 'click' ? 'SELECTED' : gesture.type.replace('-', ' ')}
            </span>
          </div>
          
          <div className="mt-1 flex gap-2 opacity-40">
            <span className="text-[8px] font-mono">X:{gesture.x.toFixed(2)}</span>
            <span className="text-[8px] font-mono">Y:{gesture.y.toFixed(2)}</span>
          </div>
        </motion.div>

        {gesture.type === 'pinch' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-10 flex items-center gap-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <div className="text-[8px] font-bold text-white uppercase tracking-tighter">Linking...</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GestureCursor;
