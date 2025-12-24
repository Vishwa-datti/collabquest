
import React, { useState, useRef, useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { UserProfile } from '../types';
import { AppFeedback } from './AppFeedback';

interface LayoutProps {
  children: React.ReactNode;
  user?: UserProfile;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AppIcon size={44} className="rounded-xl" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-[#1e293b] leading-tight tracking-tight">CollabQuest</h1>
              <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.1em]">STUDENT ALPHA</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#" className="text-[13px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Explorer</a>
            <a href="#" className="text-[13px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">My Teams</a>
            <a href="#" className="text-[13px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Labs</a>
          </nav>

          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {user?.name && (
              <div className="hidden sm:block text-right">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{user.name}</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Merit Level: 1</p>
              </div>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-11 h-11 rounded-full border-2 p-0.5 transition-all active:scale-90 overflow-hidden shadow-sm ${isMenuOpen ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-indigo-300'}`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <img src={user?.avatar || "https://picsum.photos/seed/me/40"} className="w-full h-full rounded-full object-cover" alt="User Profile" />
            </button>

            {/* Account Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
                <div className="mb-8">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Signed in as</p>
                  <p className="text-base font-bold text-slate-900 leading-none mb-1">{user?.name || 'Guest Student'}</p>
                  <p className="text-sm font-medium text-slate-400 truncate">{user?.email || 'local-merit-session'}</p>
                </div>
                
                <div className="space-y-4 mb-8">
                   <button className="w-full text-left py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                     Account Settings
                   </button>
                   <button className="w-full text-left py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                     Merit Verification
                   </button>
                </div>

                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full py-5 bg-[#fff1f2] text-[#e11d48] rounded-[1.5rem] text-sm font-black uppercase tracking-[0.15em] hover:bg-[#ffe4e6] transition-all border border-transparent active:scale-[0.98]"
                >
                  Clear Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white">
        {children}
      </main>
      
      {/* Floating AI Status Indicator */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button className="w-14 h-14 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center group hover:scale-110 transition-all active:scale-95">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
               <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600" fill="currentColor">
                 <path d="M12 2L14.85 8.15L21 11L14.85 13.85L12 20L9.15 13.85L3 11L9.15 8.15L12 2Z" />
               </svg>
            </div>
          </div>
          <span className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Synergy Engine Active
          </span>
        </button>
      </div>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-10">
          
          <AppFeedback />

          <div className="flex flex-col items-center text-center gap-2 mt-8">
            <p className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">© 2025 CollabQuest — Ethical Merit-First Matching</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Built by Team CollabQuest · Hackathon Prototype
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-xs font-black text-slate-300 hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-xs font-black text-slate-300 hover:text-indigo-600 transition-colors uppercase tracking-widest">Ethical Charter</a>
            <a href="#" className="text-xs font-black text-slate-300 hover:text-indigo-600 transition-colors uppercase tracking-widest">Open Source</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
