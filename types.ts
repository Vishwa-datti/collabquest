
export enum Role {
  Frontend = 'Frontend Developer',
  Backend = 'Backend Developer',
  UIUX = 'UI/UX Designer',
  PM = 'Product Manager',
  DataScience = 'Data Scientist',
  Marketing = 'Marketing Lead'
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  skills: string[];
  interests: string[];
  availability: string;
  preferredRoles: Role[];
  bio: string;
  avatar: string;
  portfolioUrl?: string; 
  skillAssessments?: { skill: string; score: number }[];
  location?: string; 
  timezone?: string; 
  domainExpertise?: string[]; 
}

export interface Project {
  id: string;
  title: string;
  description: string;
  hackathonName?: string;
  requiredRoles: Role[];
  tags: string[];
  dueDate?: string;
}

export interface MatchResult {
  userId: string;
  score: number;
  confidence: number;
  reasoning: string;
  complementarySkills: string[];
  timezoneOverlap: number; 
}

export interface MatchingResponse {
  matches: MatchResult[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'To-Do' | 'In Progress' | 'Done';
  dueDate?: number;
}

export interface Team {
  id: string;
  projectName: string;
  members: UserProfile[];
  messages: ChatMessage[];
  tasks: Task[];
}

export const isProfileComplete = (profile: Partial<UserProfile>): boolean => {
  return (
    (profile.skills?.length ?? 0) >= 1 &&
    (profile.interests?.length ?? 0) >= 1 &&
    (profile.availability?.length ?? 0) > 0 &&
    (profile.preferredRoles?.length ?? 0) >= 1 &&
    (profile.portfolioUrl?.length ?? 0) > 5
  );
};
