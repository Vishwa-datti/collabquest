
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { EthicsPanel } from './components/EthicsPanel';
import { TrustMessage } from './components/TrustMessage';
import { Onboarding } from './components/Onboarding';
import { SwipeCard } from './components/SwipeCard';
import { ProfileSetup } from './components/ProfileSetup';
import { Auth } from './components/Auth';
import { TeamDashboard } from './components/TeamDashboard';
import { UserProfile, Project, Role, MatchResult, isProfileComplete, Team } from './types';
import { getTeammateMatches } from './services/geminiService';

const INITIAL_PROJECT: Project = {
  id: 'p1',
  title: 'AI Eco-Tracker 2025',
  hackathonName: 'Microsoft Global Innovation Summit',
  description: 'A mobile app that uses real-time computer vision to categorize household waste and suggest circular economy habits.',
  requiredRoles: [Role.Frontend, Role.DataScience, Role.UIUX],
  tags: ['Sustainability', 'Edge AI', '2025'],
  dueDate: '2025-12-15'
};

const INITIAL_USER: UserProfile = {
  id: 'me',
  name: '',
  email: '',
  skills: [],
  interests: [],
  availability: '',
  preferredRoles: [],
  bio: 'Searching for a mission-driven team to build impactful software.',
  avatar: 'https://picsum.photos/seed/alex-2025/200',
  portfolioUrl: ''
};

const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    skills: ['React Native', 'TypeScript', 'Tailwind', 'Azure Functions'],
    interests: ['Sustainability', 'Productivity Tools'],
    availability: '10 hrs/week',
    preferredRoles: [Role.Frontend, Role.UIUX],
    bio: 'Frontend dev who loves building snappy apps. I have experience with Azure serverless and edge computing!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    portfolioUrl: 'https://github.com/sarahchen',
    location: 'Remote',
    timezone: 'GMT+8'
  },
  {
    id: 'u2',
    name: 'Marcus Thorne',
    skills: ['Python', 'PyTorch', 'C#', '.NET 9'],
    interests: ['Climate Change', 'Generative AI'],
    availability: '15 hrs/week',
    preferredRoles: [Role.DataScience, Role.Backend],
    bio: 'Backend specialist focused on scalable ML pipelines. I love Microsoft tech stacks and modern data engineering.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    portfolioUrl: 'https://github.com/mthorne',
    location: 'Remote',
    timezone: 'GMT+0'
  },
  {
    id: 'u3',
    name: 'Elena Rodriguez',
    skills: ['Figma', 'Prototyping', 'User Research'],
    interests: ['Accessibility', 'Education'],
    availability: '5 hrs/week',
    preferredRoles: [Role.UIUX],
    bio: 'Inclusive design is my core focus. Let\'s make this Microsoft project accessible to everyone!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    portfolioUrl: 'https://behance.net/elena-r',
    location: 'Remote',
    timezone: 'GMT-5'
  },
  {
    id: 'u4',
    name: 'Devin Page',
    skills: ['Rust', 'Wasm', 'Backend'],
    interests: ['Performance', 'Security'],
    availability: '20 hrs/week',
    preferredRoles: [Role.Backend],
    bio: 'Systems enthusiast. I ensure the infrastructure is robust, fast, and secure for 2025 scaling.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    portfolioUrl: 'https://github.com/dpage',
    location: 'Remote',
    timezone: 'GMT+1'
  }
];

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [currentProject, setCurrentProject] = useState<Project>(INITIAL_PROJECT);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setAuthenticated(true);
    }
    const savedProject = localStorage.getItem('current_project');
    if (savedProject) setCurrentProject(JSON.parse(savedProject));
    const onboardingDone = localStorage.getItem('onboarding_done');
    if (onboardingDone) setShowOnboarding(false);
    const savedTeam = localStorage.getItem('active_squad');
    if (savedTeam) {
      setActiveTeam(JSON.parse(savedTeam));
      setShowDashboard(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) localStorage.setItem('current_user', JSON.stringify(currentUser));
  }, [currentUser, authenticated]);

  useEffect(() => {
    localStorage.setItem('current_project', JSON.stringify(currentProject));
  }, [currentProject]);

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
    setCurrentUser(INITIAL_USER);
    setCurrentProject(INITIAL_PROJECT);
    setActiveTeam(null);
    setShowDashboard(false);
    setHasRun(false);
    setMatches([]);
    setFinished(false);
    setShowOnboarding(true);
    window.location.reload();
  };

  const runMatching = async () => {
    if (!isProfileComplete(currentUser)) {
      setError("Please complete your profile first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getTeammateMatches(currentUser, currentProject, MOCK_USERS);
      const existingIds = activeTeam?.members.map(m => m.id) || [currentUser.id];
      const filtered = result.matches.filter(m => !existingIds.includes(m.userId));
      
      setMatches(filtered.sort((a,b) => b.score - a.score));
      setHasRun(true);
      setCurrentIndex(0);
      setFinished(filtered.length === 0);
    } catch (err: any) {
      setError("Synergy Engine error. Please check your merit profile.");
    } finally {
      setLoading(false);
    }
  };

  const launchSquad = (partner: UserProfile) => {
    const existingSquad = activeTeam?.members || [currentUser];
    const newMembers = [...existingSquad];
    if (!newMembers.find(m => m.id === partner.id)) {
        newMembers.push(partner);
    }

    const newTeam: Team = {
      id: activeTeam?.id || `squad-${Date.now()}`,
      projectName: currentProject.title,
      members: newMembers,
      messages: [
        ...(activeTeam?.messages || []),
        {
          id: `init-${Date.now()}`,
          senderId: partner.id,
          senderName: partner.name,
          text: `Hey squad! I'm ${partner.name}. Excited to join ${currentProject.title} and help out!`,
          timestamp: Date.now()
        }
      ],
      tasks: activeTeam?.tasks || [
        { id: 't1', title: 'Initial Project Architecture', status: 'In Progress', dueDate: Date.now() + 86400000 * 3 },
        { id: 't2', title: 'Define MVP Features', status: 'To-Do', dueDate: Date.now() + 86400000 * 5 },
      ]
    };
    setActiveTeam(newTeam);
    setShowDashboard(true);
    localStorage.setItem('active_squad', JSON.stringify(newTeam));
  };

  const handleAction = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const match = matches[currentIndex];
      const partner = MOCK_USERS.find(u => u.id === match.userId)!;
      launchSquad(partner);
    } else {
      if (currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    }
  };

  const clearSquad = () => {
    if (confirm("Disband this squad? This will clear all synced messages and progress.")) {
      setActiveTeam(null);
      setShowDashboard(false);
      localStorage.removeItem('active_squad');
    }
  };

  if (showOnboarding) {
    return <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem('onboarding_done', 'true'); }} />;
  }

  if (!authenticated) {
    return <Layout><Auth onLogin={(data) => { setCurrentUser({ ...currentUser, ...data }); setAuthenticated(true); }} /></Layout>;
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        {showDashboard && activeTeam ? (
          <div className="max-w-6xl mx-auto">
             <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div className="flex flex-col">
                  <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">Synergy Dashboard</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">CollabQuest 2025 Release</p>
                </div>
                <button 
                  onClick={() => setShowDashboard(false)} 
                  className="px-8 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-500 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all uppercase tracking-widest"
                >
                  ← Find More Partners
                </button>
             </div>
             <TeamDashboard 
              team={activeTeam} 
              currentUser={currentUser} 
              project={currentProject} 
              onUpdateProject={setCurrentProject}
              onAddMember={() => setShowDashboard(false)}
              onClearSquad={clearSquad}
             />
          </div>
        ) : (
          <>
            <div className="text-center mb-16 px-4">
              <h2 className="text-4xl sm:text-[64px] font-black text-[#1e293b] mb-6 tracking-tighter leading-tight">
                Team Up on <span className="text-[#6366f1]">Merit.</span>
              </h2>
              <div className="flex justify-center max-w-2xl mx-auto">
                 <TrustMessage />
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-white border border-slate-100 rounded-[3rem] p-8 sm:p-12 shadow-sm mb-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 bg-[#eef2ff] text-[#6366f1] rounded-full text-[10px] font-black uppercase tracking-widest">Active Search</span>
                      {activeTeam && (
                        <button 
                          onClick={() => setShowDashboard(true)}
                          className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline flex items-center gap-2"
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Squad Synced ({activeTeam.members.length})
                        </button>
                      )}
                     </div>
                     <button onClick={() => setIsEditingProject(!isEditingProject)} className="text-[11px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                       {isEditingProject ? '✓ Finalize Search' : '✎ Refine Mission'}
                     </button>
                  </div>

                  {isEditingProject ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Launch Title</label>
                          <input 
                            type="text"
                            value={currentProject.title}
                            onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-black focus:ring-4 focus:ring-indigo-50 focus:outline-none text-slate-900"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mission Statement</label>
                          <textarea 
                            value={currentProject.description}
                            onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-base leading-relaxed min-h-[140px] text-slate-600 font-medium"
                          />
                       </div>
                    </div>
                  ) : (
                    <div className="max-w-4xl">
                      <h3 className="text-3xl sm:text-[44px] font-black text-[#1e293b] mb-6 tracking-tight leading-none">{currentProject.title}</h3>
                      <p className="text-[#64748b] text-lg sm:text-xl leading-relaxed mb-10 font-medium">{currentProject.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {currentProject.requiredRoles.map(role => (
                          <span key={role} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-start">
                <div className="space-y-12">
                  <ProfileSetup currentProfile={currentUser} onUpdate={setCurrentUser} />
                  <EthicsPanel />
                </div>

                <div className="flex flex-col items-center justify-center min-h-[500px] sticky top-32">
                  {!isProfileComplete(currentUser) ? (
                     <div className="text-center p-12 bg-white border border-slate-100 rounded-[3rem] w-full shadow-sm border-dashed">
                       <div className="text-5xl mb-6">🛡️</div>
                       <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Profile Locked</h4>
                       <p className="text-slate-400 text-xs font-medium leading-relaxed">Complete your merit verification to unlock the global synergy scan.</p>
                     </div>
                  ) : loading ? (
                     <div className="text-center bg-white p-16 rounded-[3rem] border border-slate-100 w-full shadow-2xl">
                        <div className="w-16 h-16 border-[4px] border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                        <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.4em] animate-pulse">Running Global Scout...</p>
                     </div>
                  ) : hasRun && matches.length > 0 && !finished ? (
                    <SwipeCard 
                      user={MOCK_USERS.find(u => u.id === matches[currentIndex].userId)!}
                      match={matches[currentIndex]}
                      onAction={handleAction}
                      isActive={true}
                    />
                  ) : finished ? (
                    <div className="text-center p-12 bg-white border border-slate-100 rounded-[3rem] w-full shadow-2xl animate-in zoom-in">
                      <div className="text-6xl mb-6">🏁</div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Scan Finished</h4>
                      <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed px-4">We've reached the end of the current global talent cluster for your mission.</p>
                      <button onClick={runMatching} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl">Restart Scan</button>
                    </div>
                  ) : (
                    <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 w-full group hover:border-indigo-300 transition-all duration-500">
                      <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-700">🚀</div>
                      <h4 className="text-2xl font-black text-slate-400 uppercase tracking-tight group-hover:text-slate-600 transition-colors">Engine Ready</h4>
                      <p className="text-slate-400 text-xs mt-3 font-medium max-w-xs mx-auto leading-relaxed group-hover:text-slate-500">Your merit is verified. Initiate the scout to reveal your most compatible mission partners.</p>
                      <button 
                        onClick={runMatching}
                        className="mt-10 px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105"
                      >
                        Launch Global Scout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default App;
