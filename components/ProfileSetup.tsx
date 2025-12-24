
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Role, isProfileComplete } from '../types';
import { getVerificationSummary } from '../services/geminiService';

interface ProfileSetupProps {
  onUpdate: (profile: UserProfile) => void;
  currentProfile: UserProfile;
}

const SKILL_QUIZZES: Record<string, { q: string; a: string; options: string[] }> = {
  'React': { q: 'Which of these is a built-in React Hook?', a: 'useState', options: ['useState', 'useFetch', 'useGlobal', 'useStore'] },
  'Python': { q: 'Which keyword is used to define a function in Python?', a: 'def', options: ['func', 'define', 'def', 'function'] },
  'Figma': { q: 'What is the primary format for sharing Figma prototypes?', a: 'Link', options: ['SVG', 'PDF', 'Link', 'PNG'] },
  'Node.js': { q: 'Which module is used to create a web server in Node.js?', a: 'http', options: ['fs', 'http', 'path', 'url'] },
  'SQL': { q: 'Which clause is used to filter rows in a SELECT statement?', a: 'WHERE', options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'] },
  'Product Strategy': { q: 'What does "MVP" stand for in Product Management?', a: 'Minimum Viable Product', options: ['Most Valuable Player', 'Minimum Viable Product', 'Major View Point', 'Model View Presenter'] },
  'UI Design': { q: 'What does the "A" in the accessibility standard WCAG stand for?', a: 'Accessibility', options: ['Accessibility', 'Artistic', 'Adaptability', 'Accessibility'] },
  'Copywriting': { q: 'What is the "Call to Action" primarily intended for?', a: 'Conversion', options: ['Description', 'Conversion', 'Navigation', 'SEO'] },
};

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.length > 0;
  } catch {
    return false;
  }
};

const getFriendlyErrorMessage = (errCode: string) => {
  switch (errCode) {
    case 'NETWORK_ERROR':
      return "Network connection unstable. Please check your internet and try again.";
    case 'RATE_LIMIT':
      return "The synergy engine is currently busy. Please wait a moment before retrying.";
    case 'API_KEY_MISSING':
    case 'INVALID_API_KEY':
      return "Merit connection lost. Please re-authenticate or check your AI settings.";
    case 'EMPTY_RESPONSE':
      return "The AI couldn't generate a summary this time. Let's try scanning again.";
    default:
      return "An unexpected error occurred while analyzing your merit profile.";
  }
};

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onUpdate, currentProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [quizSkill, setQuizSkill] = useState<string | null>(null);
  const [verificationSummary, setVerificationSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  const roles = Object.values(Role);
  const commonSkills = ['React', 'Python', 'Figma', 'Node.js', 'SQL', 'Product Strategy', 'UI Design', 'Copywriting'];
  const commonInterests = ['Sustainability', 'HealthTech', 'Education', 'Social Impact', 'FinTech', 'AI/ML'];

  const complete = isProfileComplete(profile);

  const fetchSummary = useCallback(async (p: UserProfile) => {
    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const summary = await getVerificationSummary(p);
      setVerificationSummary(summary);
    } catch (err: any) {
      setSummaryError(err.message || "UNKNOWN_ERROR");
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    if (complete && profile.portfolioUrl && isValidUrl(profile.portfolioUrl) && !verificationSummary && !loadingSummary && !summaryError) {
      fetchSummary(profile);
    } else if (!complete) {
      setVerificationSummary(null);
      setSummaryError(null);
    }
  }, [complete, profile.portfolioUrl, fetchSummary, verificationSummary, loadingSummary, summaryError]);

  const toggleItem = (list: string[], item: string) => 
    list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const skill = customSkill.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
      setCustomSkill('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProfile({ ...profile, portfolioUrl: val });
    setVerificationSummary(null);
    setSummaryError(null);
    
    if (val && !isValidUrl(val)) {
      setUrlValidationError("Please enter a valid URL (e.g., github.com/username)");
    } else {
      setUrlValidationError(null);
    }
  };

  const handleSave = () => {
    if (profile.portfolioUrl && !isValidUrl(profile.portfolioUrl)) {
      setUrlValidationError("Cannot save with an invalid portfolio URL.");
      setShowValidation(true);
      return;
    }
    onUpdate(profile);
    setIsSaved(true);
    setShowValidation(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const topThreeSkills = profile.skills.slice(0, 3);
  const assessments = profile.skillAssessments || [];

  const handleQuizAnswer = (skill: string, selected: string) => {
    const quiz = SKILL_QUIZZES[skill];
    const score = selected === quiz.a ? 100 : 0;
    
    const newAssessments = [
      ...assessments.filter(a => a.skill !== skill),
      { skill, score }
    ];
    
    setProfile({ ...profile, skillAssessments: newAssessments });
    setQuizSkill(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative z-10">
      {quizSkill && SKILL_QUIZZES[quizSkill] && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <h4 className="text-lg font-black text-slate-900 mb-2">Skill Check: {quizSkill}</h4>
            <p className="text-slate-600 text-sm mb-6">{SKILL_QUIZZES[quizSkill].q}</p>
            <div className="grid gap-2">
              {SKILL_QUIZZES[quizSkill].options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(quizSkill, opt)}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-700 transition-all text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setQuizSkill(null)}
              className="w-full mt-6 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Your Merit Profile</h3>
          <p className="text-slate-500 text-sm">Skills & Verification</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${complete && !urlValidationError ? 'bg-emerald-100 text-emerald-700 scale-105' : 'bg-amber-100 text-amber-700'}`}>
          {complete && !urlValidationError ? 'Ready' : 'Incomplete'}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Proof of Work (Link & Quizzes) {showValidation && !profile.portfolioUrl && <span className="text-rose-500 font-black">*Required</span>}
          </label>
          <div className="relative mb-2">
             <input 
              type="text"
              value={profile.portfolioUrl || ''}
              onChange={handleUrlChange}
              placeholder="LinkedIn or GitHub Profile URL"
              className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:outline-none pl-11 transition-all text-slate-900 ${
                urlValidationError ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-100 focus:ring-indigo-500'
              }`}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
            </div>
          </div>
          {urlValidationError && (
            <p className="text-[10px] text-rose-600 font-bold mb-4 animate-in slide-in-from-left-2">{urlValidationError}</p>
          )}
          
          {assessments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {assessments.map(a => (
                <div key={a.skill} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5">
                  <span className="text-[10px] font-black text-indigo-700 uppercase">{a.skill}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${a.score === 100 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-600'}`}>
                    {a.score === 100 ? 'VERIFIED' : 'FAILED'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {topThreeSkills.filter(s => SKILL_QUIZZES[s] && !assessments.find(a => a.skill === s)).length > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Self-Assessment Pending</p>
               <div className="flex flex-wrap gap-2">
                 {topThreeSkills
                   .filter(s => SKILL_QUIZZES[s] && !assessments.find(a => a.skill === s))
                   .map(s => (
                     <button 
                       key={s} 
                       onClick={() => setQuizSkill(s)}
                       className="px-3 py-1.5 bg-white text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition-all shadow-sm"
                     >
                       Quiz: {s}
                     </button>
                   ))
                 }
               </div>
            </div>
          )}
        </div>

        {complete && profile.portfolioUrl && isValidUrl(profile.portfolioUrl) && (
          <div className={`rounded-3xl p-6 transition-all duration-500 shadow-xl ${
            summaryError ? 'bg-rose-50 border border-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100'
          } animate-in fade-in slide-in-from-top-4`}>
            <div className="flex items-center gap-2 mb-3">
               <span className="text-xl">{summaryError ? '⚠️' : '✨'}</span>
               <span className={`text-[10px] font-black uppercase tracking-widest ${summaryError ? 'text-rose-700' : 'text-white'}`}>
                 {summaryError ? 'Engine Error' : 'AI Merit Insight'}
               </span>
            </div>
            {loadingSummary ? (
               <div className="space-y-2">
                  <div className="h-3 bg-white/20 rounded-full w-full animate-pulse"></div>
                  <div className="h-3 bg-white/20 rounded-full w-3/4 animate-pulse"></div>
               </div>
            ) : summaryError ? (
              <div>
                <p className="text-sm font-medium text-rose-900 leading-relaxed mb-4">{getFriendlyErrorMessage(summaryError)}</p>
                <button 
                  onClick={() => fetchSummary(profile)}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
                >
                  Retry Analysis
                </button>
              </div>
            ) : (
              <p className="text-sm font-medium leading-relaxed opacity-90 italic text-white">
                {verificationSummary}
              </p>
            )}
            {!summaryError && !loadingSummary && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest">Priority: High (Proof Attached)</span>
                <svg className="w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Preferred Roles (Min 1)
          </label>
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <button
                type="button"
                key={role}
                onClick={() => setProfile({ ...profile, preferredRoles: toggleItem(profile.preferredRoles as any, role) as Role[] })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  profile.preferredRoles.includes(role) 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Your Skills (Min 1)
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {commonSkills.map(skill => (
              <button
                type="button"
                key={skill}
                onClick={() => setProfile({ ...profile, skills: toggleItem(profile.skills, skill) })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  profile.skills.includes(skill) 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {skill}
              </button>
            ))}
            {profile.skills.filter(s => !commonSkills.includes(s)).map(skill => (
              <button
                type="button"
                key={skill}
                onClick={() => setProfile({ ...profile, skills: toggleItem(profile.skills, skill) })}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-indigo-600 border-indigo-600 text-white flex items-center gap-2"
              >
                {skill}
                <span className="text-[10px] opacity-60">✕</span>
              </button>
            ))}
          </div>
          
          <form onSubmit={handleAddCustomSkill} className="flex gap-2">
            <input 
              type="text" 
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add custom skill..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all"
            >
              Add
            </button>
          </form>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Project Interests (Min 1)
          </label>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map(interest => (
              <button
                type="button"
                key={interest}
                onClick={() => setProfile({ ...profile, interests: toggleItem(profile.interests, interest) })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  profile.interests.includes(interest) 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Weekly Availability
          </label>
          <select 
            value={profile.availability}
            onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
          >
            <option value="">Select Time Commitment</option>
            <option value="5 hrs/week">~5 hrs/week (Light)</option>
            <option value="10 hrs/week">~10 hrs/week (Standard)</option>
            <option value="20 hrs/week">~20 hrs/week (Intensive)</option>
          </select>
        </div>

        <div className="pt-4">
          <button 
            type="button"
            onClick={handleSave}
            disabled={!!urlValidationError}
            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg active:scale-[0.98] ${
              !!urlValidationError
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isSaved 
                  ? 'bg-emerald-600 text-white shadow-emerald-100' 
                  : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
            }`}
          >
            {isSaved ? '✓ Profile Synced' : 'Update Profile Information'}
          </button>
        </div>
      </div>
    </div>
  );
};
