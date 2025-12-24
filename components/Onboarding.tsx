
import React from 'react';
import { AppIcon } from './AppIcon';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const steps = [
    {
      title: "Merit Over Pedigree",
      desc: "CollabQuest hides college names and locations. We match you based on what you can build, not where you're from.",
      icon: "⚖️",
      accent: "from-indigo-500 to-blue-500"
    },
    {
      title: "Synergy Scoring",
      desc: "Our AI analyzes skill gaps. If you're a designer, we'll prioritize finding the developers who can bring your vision to life.",
      icon: "🧩",
      accent: "from-emerald-500 to-teal-500"
    },
    {
      title: "You're in Control",
      desc: "The AI suggests, but you decide. Use your deck to find the perfect fit through simple swipe-based feedback.",
      icon: "✨",
      accent: "from-purple-500 to-pink-500"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] max-w-sm w-full p-10 text-center shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        {/* Subtle Decorative Background Ring */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${steps[step].accent} opacity-5 rounded-full blur-2xl transition-all duration-700`}></div>
        
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <AppIcon size={80} className="shadow-2xl shadow-indigo-100 rounded-[2rem] transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg uppercase tracking-tighter">
              Ethical AI
            </div>
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-slate-100">
            {steps[step].icon}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{steps[step].title}</h2>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed px-2 font-medium">
            {steps[step].desc}
          </p>
        </div>
        
        <div className="flex justify-center gap-2.5 mb-10">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'dot-active' : 'w-2 bg-slate-200'}`} 
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
        >
          {step < steps.length - 1 ? "Next" : "Let's Find Your Team"}
        </button>
        
        <p className="mt-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
          Launch v1.0 • Merit Secure 2025
        </p>
      </div>
    </div>
  );
};
