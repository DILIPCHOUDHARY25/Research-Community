import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Application, Message, Conversation, User } from '../types';

interface AppContextType {
  projects: Project[];
  applications: Application[];
  messages: Message[];
  conversations: Conversation[];
  users: User[];
  createProject: (project: Omit<Project, 'id' | 'author' | 'applications' | 'createdAt'>) => void;
  applyToProject: (projectId: string, message: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (userId: string) => Conversation | null;
}

const AppContext = createContext<AppContextType | null>(null);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@stanford.edu',
    name: 'Alice Chen',
    role: 'student',
    bio: 'PhD student in AI/ML at Stanford, passionate about computer vision and robotics.',
    interests: ['AI', 'Machine Learning', 'Computer Vision', 'Robotics'],
    links: {
      linkedin: 'https://linkedin.com/in/alicechen',
      github: 'https://github.com/alicechen',
    },
    preferences: {
      wantToHire: false,
      wantToJoin: true,
      wantToCollaborate: true,
      remote: true,
      onSite: true,
    },
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
  },
  {
    id: '2',
    email: 'bob@biotech.com',
    name: 'Bob Rodriguez',
    role: 'founder',
    bio: 'Serial entrepreneur in biotech. Looking for technical co-founders and research partners.',
    interests: ['Biotech', 'Drug Discovery', 'Genomics', 'Healthcare'],
    links: {
      linkedin: 'https://linkedin.com/in/bobrodriguez',
      website: 'https://biotechventures.com',
    },
    preferences: {
      wantToHire: true,
      wantToJoin: false,
      wantToCollaborate: true,
      remote: true,
      onSite: false,
    },
    createdAt: new Date('2024-02-01'),
    lastActive: new Date(),
  },
  {
    id: '3',
    email: 'carol@mit.edu',
    name: 'Dr. Carol Zhang',
    role: 'professor',
    bio: 'Professor of Quantum Computing at MIT. Leading research in quantum algorithms and error correction.',
    interests: ['Quantum Computing', 'Quantum Algorithms', 'Physics', 'Mathematics'],
    links: {
      website: 'https://mit.edu/~czhang',
      linkedin: 'https://linkedin.com/in/carolzhang',
    },
    preferences: {
      wantToHire: true,
      wantToJoin: false,
      wantToCollaborate: true,
      remote: false,
      onSite: true,
    },
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
  },
];

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Drug Discovery Platform',
    description: 'Looking for ML engineers to help build a platform that uses transformer models to predict drug-protein interactions. Great opportunity to work on cutting-edge research with real-world impact.',
    authorId: '2',
    author: mockUsers[1],
    timeline: '6 months',
    rolesNeeded: ['ML Engineer', 'Research Intern', 'Data Scientist'],
    type: 'startup',
    tags: ['AI', 'Machine Learning', 'Biotech', 'Drug Discovery'],
    applications: [],
    createdAt: new Date('2024-02-15'),
    isActive: true,
    isRemote: true,
  },
  {
    id: '2',
    title: 'Quantum Error Correction Research',
    description: 'Seeking passionate undergraduate/graduate students to join our quantum computing research lab. Focus on developing new error correction codes for NISQ devices.',
    authorId: '3',
    author: mockUsers[2],
    timeline: '1 year',
    rolesNeeded: ['Research Assistant', 'PhD Student'],
    type: 'collaboration',
    tags: ['Quantum Computing', 'Physics', 'Mathematics', 'Research'],
    applications: [],
    createdAt: new Date('2024-02-10'),
    isActive: true,
    location: 'Cambridge, MA',
    isRemote: false,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('projects');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) }));
    }
    return defaultProjects;
  });
  const [applications, setApplications] = useState<Application[]>(() => {
    const stored = localStorage.getItem('applications');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((a: any) => ({ ...a, createdAt: new Date(a.createdAt) }));
    }
    return [];
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users] = useState<User[]>(mockUsers);

  // Persist projects and applications to localStorage
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const createProject = (projectData: Omit<Project, 'id' | 'author' | 'applications' | 'createdAt'>) => {
    const author = users.find(u => u.id === projectData.authorId);
    if (!author) return;
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      author,
      applications: [],
      createdAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const applyToProject = (projectId: string, message: string) => {
    // Mock application - would normally require authentication
    const userId = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id : '1';
    const user = users.find(u => u.id === userId) || users[0];
    const newApplication: Application = {
      id: Date.now().toString(),
      userId: user.id,
      user,
      projectId,
      message,
      status: 'pending',
      createdAt: new Date(),
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const sendMessage = (receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // Mock current user
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getConversation = (userId: string): Conversation | null => {
    return conversations.find(c =>
      c.participants.some(p => p.id === userId)
    ) || null;
  };

  return (
    <AppContext.Provider value={{
      projects,
      applications,
      messages,
      conversations,
      users,
      createProject,
      applyToProject,
      sendMessage,
      getConversation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}