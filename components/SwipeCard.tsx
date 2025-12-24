
import React, { useState } from 'react';
import { UserProfile, MatchResult } from '../types';

interface SwipeCardProps {
  user: UserProfile;
  match: MatchResult;
  onAction: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ user, match, onAction, isActive }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  if (!isActive) return null;

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    setTimeout(() => {
      onAction(type === 'up' ? 'right' : 'left');
      setFeedback(null);
    }, 800);
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-12 fade-in duration-500">
      {/* Top Section */}
      <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Verification Badge */}
        {user.portfolioUrl && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Merit Verified
          </div>
        )}

        <div className="absolute bottom-6 left-8 right-8">
          <h3 className="text-3xl font-black text-white mb-2">{user.name}</h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg uppercase tracking-widest">
              {user.location || 'Remote'} • {user.timezone || 'UTC'}
            </span>
          </div>
        </div>
      </div>

      {/* Compatibility Stats */}
      <div className="flex items-center justify-between px-8 py-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{match.score}% Merit Synergy</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400">Scan Confidence: {match.confidence}%</div>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Matching Reasoning</p>
        <p className="text-sm text-slate-700 leading-relaxed mb-6 italic">
          "{match.reasoning}"
        </p>

        <div className="mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Key Complementary Skills</p>
          <div className="flex flex-wrap gap-2">
            {match.complementarySkills.map(s => (
              <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black border border-indigo-100 uppercase tracking-tight shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        {feedback && (
          <div className={`absolute inset-0 z-[50] flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in duration-300 ${feedback === 'up' ? 'bg-indigo-600/90' : 'bg-rose-600/90'}`}>
            <span className="text-6xl mb-4 animate-bounce">{feedback === 'up' ? '✨' : '👋'}</span>
            <p className="text-white font-black text-xl text-center px-8 uppercase tracking-widest leading-tight">
              {feedback === 'up' ? 'Partnering Up...' : 'Adjusting Synergy Lens...'}
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4 mt-auto">
          <button 
            onClick={() => handleFeedback('down')}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all tracking-widest active:scale-95"
          >
            Skip
          </button>
          <button 
            onClick={() => handleFeedback('up')}
            className="flex-[1.5] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 tracking-widest active:scale-95"
          >
            Partner Up
          </button>
        </div>
      </div>
    </div>
  );
};
