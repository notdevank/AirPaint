import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush, Sparkles, Download } from 'lucide-react';
import type { GestureState } from '../hooks/useGestures';

interface Line {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface AirPaintProps {
  gesture: GestureState;
}

const COLORS = ['#00E5FF', '#7000FF', '#FF00E5', '#FFD600', '#00FF85'];

const AirPaint: React.FC<AirPaintProps> = ({ gesture }) => {
  const [lines, setLine] = useState<Line[]>([]);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [brushWidth, setBrushWidth] = useState(5);
  const [w, setW] = useState(window.innerWidth);
  const [h, setH] = useState(window.innerHeight);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
      setH(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isDrawing = useRef(false);
  const undoCooldown = useRef(false);
  const colorRef = useRef(currentColor);
  const widthRef = useRef(brushWidth);

  useEffect(() => { colorRef.current = currentColor; }, [currentColor]);
  useEffect(() => { widthRef.current = brushWidth; }, [brushWidth]);

  useEffect(() => {
    if (gesture.type === 'point') {
      const newPoint = { x: gesture.x * window.innerWidth, y: gesture.y * window.innerHeight };
      
      if (!isDrawing.current) {
        setLine(prev => [...prev, { points: [newPoint], color: colorRef.current, width: widthRef.current }]);
        isDrawing.current = true;
      } else {
        setLine(prev => {
          if (prev.length === 0) return prev;
          const lastLine = prev[prev.length - 1];
          const lastPt = lastLine.points[lastLine.points.length - 1];
          const dist = Math.sqrt(Math.pow(lastPt.x - newPoint.x, 2) + Math.pow(lastPt.y - newPoint.y, 2));
          if (dist < 3) return prev;

          const updatedLine = { ...lastLine, points: [...lastLine.points, newPoint] };
          return [...prev.slice(0, -1), updatedLine];
        });
      }
    } else {
      isDrawing.current = false;
    }

    if (gesture.type === 'swipe-left' || gesture.type === 'swipe-right') {
      setLine([]);
    }

    if (gesture.type === 'closed' && !undoCooldown.current) {
        setLine(prev => prev.slice(0, -1));
        undoCooldown.current = true;
        setTimeout(() => { undoCooldown.current = false; }, 1000);
    }
  }, [gesture.x, gesture.y, gesture.type]);

  useEffect(() => {
    if (gesture.type === 'pinch') {
        const scale = Math.max(0, (0.12 - gesture.pinchDistance) * 10); 
        const newWidth = Math.max(2, Math.min(60, scale * 50));
        setBrushWidth(newWidth);
    }
  }, [gesture.pinchDistance, gesture.type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    lines.forEach(line => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.shadowBlur = 15;
      ctx.shadowColor = line.color;
      
      line.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });
  }, [lines]);

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `spatial-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        className="absolute inset-0"
      />

      <div className="absolute top-8 left-8 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Paintbrush className="text-slate-950" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">AirPaint</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary tracking-widest opacity-80">
              <Sparkles size={10} /> ENGINE ACTIVE
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-3xl flex flex-col gap-6 border-white/5 pointer-events-auto">
          <div className="space-y-2">
            <span className="text-[8px] font-black uppercase opacity-40 px-2">Active Color</span>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrentColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${currentColor === c ? 'scale-125 border-2 border-white' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c, boxShadow: currentColor === c ? `0 0 15px ${c}` : 'none' }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[8px] font-black uppercase opacity-40 px-2">Brush Dynamics</span>
            <div className="px-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        animate={{ width: `${(brushWidth / 60) * 100}%` }}
                        className="h-full bg-primary" 
                    />
                </div>
                <div className="flex justify-between mt-2 text-[8px] font-mono opacity-40">
                    <span>MIN: 2PX</span>
                    <span>SIZE: {brushWidth.toFixed(0)}PX</span>
                </div>
            </div>
          </div>

          <button 
            onClick={saveImage}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-3 transition-colors group"
          >
            <Download size={14} className="text-primary group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Save Masterpiece</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass px-8 py-3 rounded-full flex gap-8 items-center border-white/10">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase opacity-60">
            <div className="w-1.5 h-1.5 rounded-full border border-white" /> POINT TO DRAW
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase opacity-60">
            <div className="w-1.5 h-1.5 rounded-full border border-white" /> PINCH TO RESIZE
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase opacity-60">
            <div className="w-1.5 h-1.5 rounded-full border border-white" /> FIST TO UNDO
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-rose-400">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> SWIPE TO CLEAR
        </div>
      </div>
    </div>
  );
};

export default AirPaint;
