export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio: string;
  interests: string[];
  links: UserLinks;
  preferences: UserPreferences;
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
}

export type UserRole = 'student' | 'researcher' | 'founder' | 'professor';

export interface UserLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  resume?: string;
}

export interface UserPreferences {
  wantToHire: boolean;
  wantToJoin: boolean;
  wantToCollaborate: boolean;
  remote: boolean;
  onSite: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  authorId: string;
  author: User;
  requirements: string[];
  budget: string;
  duration: string;
  tags: string[];
  applications: Application[];
  createdAt: Date;
  status: 'active' | 'inactive' | 'completed';
  location?: string;
  isRemote?: boolean;
}

export type ProjectType = 'internship' | 'collaboration' | 'startup' | 'hackathon';

export interface Application {
  id: string;
  userId: string;
  user: User;
  projectId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: Date;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'interview';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  messages: Message[];
}

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalMessages: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newProjectsThisWeek: number;
}