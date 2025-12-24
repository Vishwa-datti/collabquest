
import React, { useState, useEffect, useRef } from 'react';
import { Team, UserProfile, ChatMessage, Task, Project } from '../types';
import { simulatePeerResponse } from '../services/geminiService';

interface TeamDashboardProps {
  team: Team;
  currentUser: UserProfile;
  project: Project;
  onUpdateProject?: (project: Project) => void;
  onAddMember?: () => void;
  onClearSquad?: () => void;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ 
  team, 
  currentUser, 
  project, 
  onUpdateProject, 
  onAddMember,
  onClearSquad 
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'board'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(team.messages);
  const [tasks, setTasks] = useState<Task[]>(team.tasks);
  const [typingMember, setTypingMember] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [missionText, setMissionText] = useState(project.description);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingMember]);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts?: number) => {
    if (!ts) return null;
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || typingMember) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name || 'Me',
      text: newMessage,
      timestamp: Date.now()
    };

    const currentMsgText = newMessage;
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setNewMessage('');
    
    const peers = team.members.filter(m => m.id !== currentUser.id);
    if (peers.length > 0) {
      const numResponders = Math.random() > 0.5 ? Math.min(3, peers.length) : 1;
      const responders = [...peers].sort(() => 0.5 - Math.random()).slice(0, numResponders);
      
      for (const responder of responders) {
        setTypingMember(responder.name);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
          const responseText = await simulatePeerResponse(responder, project, updatedHistory, currentMsgText);
          
          const peerMsg: ChatMessage = {
            id: `msg-${Date.now() + Math.random()}`,
            senderId: responder.id,
            senderName: responder.name,
            text: responseText,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, peerMsg]);
        } catch (err) {
          console.error("Simulation failed", err);
        } finally {
          setTypingMember(null);
        }
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowClearConfirm(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'Done' ? 'To-Do' : 'Done' } : t));
  };

  const updateTaskDate = (taskId: string, dateStr: string) => {
    const ts = new Date(dateStr).getTime();
    setTasks(tasks.map(t => t.id === taskId ? { ...t, dueDate: ts } : t));
  };

  const saveMission = () => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, description: missionText });
    }
    setIsEditingMission(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden h-[750px] flex flex-col animate-in fade-in slide-in-from-bottom-12">
      {/* Profile Modal */}
      {viewingProfile && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setViewingProfile(null)}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewingProfile(null)} 
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex flex-col items-center text-center">
              <img src={viewingProfile.avatar} className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-xl mb-6 object-cover" alt="" />
              <h3 className="text-2xl font-black text-slate-900 mb-1">{viewingProfile.name}</h3>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Merit Verified Teammate</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium italic">"{viewingProfile.bio}"</p>
              <button 
                onClick={() => setViewingProfile(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95"
              >
                Return to Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white min-h-[140px]">
        <div className="flex items-center gap-6 overflow-hidden">
          <div className="flex -space-x-3 shrink-0">
            {team.members.map((m, i) => (
              <button 
                key={m.id} 
                onClick={() => setViewingProfile(m)}
                className="w-12 h-12 rounded-full border-4 border-white shadow-sm ring-1 ring-slate-100 transition-transform hover:-translate-y-1 hover:z-20 focus:outline-none overflow-hidden bg-white"
                style={{ zIndex: 20 - i }}
              >
                <img src={m.avatar} className="w-full h-full object-cover" alt={m.name} />
              </button>
            ))}
            {team.members.length < 9 && (
              <button 
                onClick={onAddMember}
                className="w-12 h-12 rounded-full bg-indigo-50 border-4 border-white shadow-sm ring-1 ring-indigo-100 flex items-center justify-center text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all group z-0"
                title="Expand Squad"
              >
                <span className="text-xl font-black group-hover:scale-110 transition-transform">+</span>
              </button>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg font-black text-[#1e293b] uppercase tracking-widest leading-none mb-2 truncate">
              {team.projectName.toUpperCase()} SQUAD
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.15em] flex items-center gap-2 whitespace-nowrap">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {team.members.length - 1} ACTIVE PARTNERS SYNCED
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 ml-4">
          <button 
            onClick={() => onClearSquad?.()}
            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
            title="Disband squad"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          
          <div className="flex bg-[#f8fafc] p-1.5 rounded-2xl border border-slate-100">
            <button 
              onClick={() => setActiveTab('chat')} 
              className={`px-6 sm:px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'chat' ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              CHAT
            </button>
            <button 
              onClick={() => setActiveTab('board')} 
              className={`px-6 sm:px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'board' ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              BOARD
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white custom-scrollbar">
        {activeTab === 'chat' ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-10 mb-8">
              {messages.map((m, idx) => {
                const isMe = m.senderId === currentUser.id;
                const sender = team.members.find(u => u.id === m.senderId);
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
                      <div className="flex items-center gap-3">
                        {!isMe && sender && (
                          <img src={sender.avatar} className="w-8 h-8 rounded-full border border-slate-100 shadow-sm" alt="" />
                        )}
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          {isMe ? 'YOU' : m.senderName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-200">
                          {formatTime(m.timestamp)}
                        </span>
                      </div>
                      <div className={`p-6 rounded-[1.5rem] text-[15px] leading-relaxed font-medium shadow-sm border transition-all ${
                        isMe 
                        ? 'bg-[#4f46e5] text-white border-transparent rounded-tr-none shadow-indigo-50' 
                        : 'bg-white border-slate-100 text-[#334155] rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              {typingMember && (
                <div className="flex justify-start animate-pulse">
                   <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                     <span className="flex gap-1">
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                     </span>
                     {typingMember} is typing...
                   </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
            
            <form onSubmit={sendMessage} className="mt-auto flex gap-4 p-3 bg-[#f8fafc] rounded-[2rem] border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message your mission squad..."
                className="flex-1 px-6 bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-300"
              />
              <button 
                type="submit"
                className="bg-[#4f46e5] text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
             <div className="p-10 bg-[#4f46e5] rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 mb-12 relative group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">MISSION GOAL</h4>
                  <button 
                    onClick={() => setIsEditingMission(!isEditingMission)}
                    className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-all"
                  >
                    {isEditingMission ? 'Save' : 'Refine'}
                  </button>
                </div>
                
                {isEditingMission ? (
                  <textarea 
                    value={missionText}
                    onChange={(e) => setMissionText(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-6 text-white text-xl font-bold italic leading-relaxed focus:outline-none min-h-[140px]"
                    autoFocus
                  />
                ) : (
                  <p className="font-bold text-xl leading-relaxed italic">"{project.description}"</p>
                )}
             </div>

             <div className="space-y-4">
                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">SQUAD MILESTONES</h5>
                {tasks.map(t => (
                  <div 
                    key={t.id} 
                    className="w-full flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-100 transition-all text-left shadow-sm group"
                  >
                    <div className="flex items-center gap-6 overflow-hidden">
                        <button 
                          onClick={() => toggleTask(t.id)}
                          className={`w-8 h-8 rounded-xl border-2 shrink-0 flex items-center justify-center transition-all ${t.status === 'Done' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 group-hover:border-indigo-400'}`}
                        >
                            {t.status === 'Done' && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                        <div className="min-w-0">
                          <span className={`text-base font-bold block truncate ${t.status === 'Done' ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                            {t.title}
                          </span>
                          <div className="flex items-center gap-3 mt-1">
                             <div className="relative group/date">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input 
                                    type="date" 
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    onChange={(e) => updateTaskDate(t.id, e.target.value)}
                                  />
                                  <svg className={`w-3.5 h-3.5 ${t.dueDate ? 'text-indigo-400' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${t.dueDate ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'}`}>
                                    {t.dueDate ? formatDate(t.dueDate) : 'Set Due Date'}
                                  </span>
                                </label>
                             </div>
                          </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
