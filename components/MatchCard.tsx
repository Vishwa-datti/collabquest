
import React, { useState } from 'react';
import { UserProfile, MatchResult } from '../types';

interface MatchCardProps {
  user: UserProfile;
  match: MatchResult;
}

export const MatchCard: React.FC<MatchCardProps> = ({ user, match }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // In a real app, this would be sent to the backend to refine the model's future outputs
    console.log(`Feedback for user ${user.id}: ${type}`);
  };

  return (
    <div className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl ${feedback === 'down' ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-indigo-50" />
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{user.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {match.score}% Score
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Confidence</span>
             <div className="text-sm font-bold text-slate-700">{match.confidence}%</div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">AI Reasoning</p>
          <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-indigo-400 pl-3">
            "{match.reasoning}"
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            We’re ~{match.confidence}% confident you’ll enjoy working together.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Key Gaps Filled</p>
          <div className="flex flex-wrap gap-1">
            {match.complementarySkills.map(s => (
              <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-tight border border-emerald-100">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
          <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            Invite to Team
          </button>
          
          <div className="flex gap-1">
            <button 
              onClick={() => handleFeedback('up')}
              className={`p-2 rounded-lg border transition-all ${feedback === 'up' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-200'}`}
              title="Helpful recommendation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.708c.94 0 1.667.83 1.45 1.754l-1.697 7.126a1.97 1.97 0 01-1.912 1.512H8.5V10l4.817-4.817a1 1 0 011.09-.217l.51.255a2 2 0 011.083 1.789V10zM2 14h6" />
              </svg>
            </button>
            <button 
              onClick={() => handleFeedback('down')}
              className={`p-2 rounded-lg border transition-all ${feedback === 'down' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200'}`}
              title="Not a good fit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.292c-.94 0-1.667-.83-1.45-1.754l1.697-7.126a1.97 1.97 0 011.912-1.512H15.5V14l-4.817 4.817a1 1 0 01-1.09.217l-.51-.255a2 2 0 01-1.083-1.789V14zM22 10h-6" />
              </svg>
            </button>
          </div>
        </div>
        
        {feedback && (
          <p className="text-[10px] text-center text-slate-400 mt-2 font-semibold italic">
            Feedback received. We'll adjust your future lens.
          </p>
        )}
      </div>
    </div>
  );
};
