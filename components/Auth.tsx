
import React, { useState } from 'react';
import { AppIcon } from './AppIcon';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 perspective-container">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 max-w-md w-full text-center animate-in zoom-in slide-in-from-top-12 [transform:rotateX(5deg)] hover:[transform:rotateX(0deg)] transition-all duration-700">
        <div className="flex justify-center mb-8">
          <AppIcon size={70} className="shadow-xl shadow-indigo-100 rounded-3xl" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-sm mb-8">Join the merit-based student network.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 shadow-inner"
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">University Email</label>
            <input 
              type="email" 
              required
              placeholder="alex@edu.university.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 shadow-inner"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-2xl transition-all shadow-xl shadow-indigo-100 mt-4 active:scale-95 active:translate-y-0"
          >
            Sign In with Merit
          </button>
        </form>
        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          🔒 Encrypted Connection. <br/>Your academic data is protected.
        </p>
      </div>
    </div>
  );
};
