
import React, { useState } from 'react';

export const AppFeedback: React.FC = () => {
  const [voted, setVoted] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (type: 'positive' | 'negative') => {
    setVoted(type);
    console.log(`[App Feedback] User voted: ${type}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log(`[App Feedback] Comment: ${comment}`);
    // Reset after some time
    setTimeout(() => {
      setVoted(null);
      setSubmitted(false);
      setComment('');
    }, 5000);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-8 p-8 bg-slate-50 border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden transition-all duration-500">
      {!voted ? (
        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-center">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Platform Evolution</h5>
            <p className="text-sm font-bold text-slate-700">How is your CollabQuest experience today?</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => handleVote('positive')}
              className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95"
            >
              <span className="text-xl group-hover:scale-125 transition-transform">👍</span>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-700 uppercase tracking-widest">Seamless</span>
            </button>
            <button 
              onClick={() => handleVote('negative')}
              className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:border-rose-200 hover:bg-rose-50 transition-all active:scale-95"
            >
              <span className="text-xl group-hover:scale-125 transition-transform">👎</span>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-rose-700 uppercase tracking-widest">Needs Work</span>
            </button>
          </div>
        </div>
      ) : !submitted ? (
        <form onSubmit={handleSubmit} className="animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl">{voted === 'positive' ? '🚀' : '🔧'}</span>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                {voted === 'positive' ? 'Great to hear! Any quick thoughts?' : 'Help us fix it. What went wrong?'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              autoFocus
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Faster matching, clearer profiles..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:outline-none font-medium"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-black transition-all"
            >
              Send
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center animate-in fade-in zoom-in-95 py-2">
          <p className="text-xl mb-2">✨</p>
          <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Feedback Received</h5>
          <p className="text-xs font-medium text-slate-400">Thank you for helping us shape the future of student collaboration.</p>
        </div>
      )}
    </div>
  );
};
