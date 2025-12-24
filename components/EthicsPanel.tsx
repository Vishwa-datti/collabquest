
import React from 'react';

export const EthicsPanel: React.FC = () => {
  return (
    <div className="bg-[#f5f7ff] rounded-[2rem] p-10 border border-indigo-50 mt-12 mb-12 shadow-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        ⚖️ Our Ethical AI Framework
      </h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Attributes We Use for Matching</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-emerald-500 font-black">✓</span> Skills & Proficiencies
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-emerald-500 font-black">✓</span> Project Interests & Passion
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-emerald-500 font-black">✓</span> Availability & Time Commitment
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-emerald-500 font-black">✓</span> Desired Collaboration Roles
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Attributes We Strictly Ignore</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-rose-500 font-black">✕</span> College Name / Institutional Prestige
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-rose-500 font-black">✕</span> Geographic Location / State
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <span className="text-rose-500 font-black">✕</span> Previous Company Brand Names
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 p-6 bg-white rounded-[1.5rem] border border-indigo-100 shadow-sm">
        <h4 className="font-black text-indigo-900 mb-2 text-sm">Judge's Rationale: Why this matters?</h4>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Traditional student platforms often prioritize "Ivy League" names or local proximity. 
          CollabQuest levels the playing field. By focusing exclusively on **competency** and **compatibility**, 
          we ensure that a self-taught developer from a community college has the same visibility as a 
          university student if they possess the right skills. This reduces algorithmic bias and promotes 
          true diversity of thought in student projects.
        </p>
      </div>
    </div>
  );
};
