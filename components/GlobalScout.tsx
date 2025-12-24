
import React, { useEffect, useState } from 'react';

export const GlobalScout: React.FC<{ isScouting: boolean }> = ({ isScouting }) => {
  const [dots, setDots] = useState<{x: number, y: number, color: string, size: number, delay: number}[]>([]);

  useEffect(() => {
    const newDots = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: Math.random() > 0.85 ? '#6366f1' : '#475569',
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="relative w-full h-44 bg-[#0f172a] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl mb-12 flex flex-col items-center justify-center transition-all duration-700">
      {/* Background Dots/Stars */}
      {dots.map((dot, i) => (
        <div 
          key={i}
          className={`absolute rounded-full transition-all duration-[3000ms] ${isScouting ? 'opacity-80' : 'opacity-20'}`}
          style={{ 
            left: `${dot.x}%`, 
            top: `${dot.y}%`, 
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            boxShadow: dot.color === '#6366f1' ? '0 0 12px #6366f1' : 'none',
            animation: isScouting ? `pulse ${2 + Math.random() * 2}s infinite alternate` : 'none',
            animationDelay: `${dot.delay}s`
          }}
        />
      ))}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 text-center px-6">
        <div className="flex items-center justify-center gap-2 mb-3">
           <span className={`h-1.5 w-1.5 rounded-full ${isScouting ? 'bg-indigo-500 animate-ping' : 'bg-slate-500'}`}></span>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Global Synergy Network</p>
        </div>
        
        <h4 className="text-white font-bold text-lg sm:text-xl tracking-tight mb-5 h-8">
          {isScouting ? 'Parsing High-Confidence Merit Clusters...' : 'Synergy Engine Standby'}
        </h4>
        
        <div className="flex gap-2 justify-center opacity-60">
            {['US-EAST', 'EU-CENTRAL', 'ASIA-SOUTH', 'LATAM'].map(reg => (
              <span key={reg} className="px-2.5 py-1 bg-white/5 text-slate-400 text-[8px] font-black rounded-lg uppercase tracking-widest border border-white/5">
                {reg}
              </span>
            ))}
        </div>
      </div>
      
      {isScouting && (
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full animate-pulse"></div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
