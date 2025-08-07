import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Application, Message, Conversation, User } from '../types';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYPUPc6wZrqP1-Y5TUieIcDaXtUolJrJs",
  authDomain: "research-community-ce9af.firebaseapp.com",
  projectId: "research-community-ce9af",
  storageBucket: "research-community-ce9af.firebasestorage.app",
  messagingSenderId: "426974432294",
  appId: "1:426974432294:web:d5dcfcb020e2808fc5aae7",
  measurementId: "G-Z925P35N21"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

interface AppContextType {
  projects: Project[];
  applications: Application[];
  messages: Message[];
  conversations: Conversation[];
  users: User[];
  createProject: (project: Omit<Project, 'id' | 'author' | 'applications' | 'createdAt'>) => Promise<void>;
  applyToProject: (projectId: string, message: string) => void;
  sendMessage: (receiverId: string, content: string) => void;
  getConversation: (userId: string) => Conversation | null;
  updateApplicationStatus: (applicationId: string, status: 'pending' | 'accepted' | 'rejected' | 'interview') => Promise<void>;
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

export function AppProvider({ children }: { children: ReactNode }) {
  // Projects from Firestore
  const [projects, setProjects] = useState<Project[]>([]);
  // Applications from Firestore (real-time)
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users] = useState<User[]>(mockUsers);

  // Real-time projects
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loaded: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        });
      });
      setProjects(loaded);
    });
    return () => unsubscribe();
  }, []);

  // Real-time applications
  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loaded: Application[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        });
      });
      setApplications(loaded);
    });
    return () => unsubscribe();
  }, []);

  // Add new project to Firestore
  const createProject = async (projectData: Omit<Project, 'id' | 'author' | 'applications' | 'createdAt'>) => {
    const author = users.find(u => u.id === projectData.authorId);
    if (!author) return;
    const newProject = {
      ...projectData,
      author,
      applications: [],
      createdAt: Timestamp.fromDate(new Date()),
    };
    await addDoc(collection(db, 'projects'), newProject);
  };

  // Add new application to Firestore
  const applyToProject = async (projectId: string, message: string) => {
    const userId = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id : '1';
    const user = users.find(u => u.id === userId) || users[0];
    const newApplication = {
      userId: user.id,
      user,
      projectId,
      message,
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date()),
    };
    await addDoc(collection(db, 'applications'), newApplication);
  };

  // Update application status (accept/reject/interview)
  const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'accepted' | 'rejected' | 'interview') => {
    const applicationRef = doc(db, 'applications', applicationId);
    await updateDoc(applicationRef, { status });
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
      updateApplicationStatus, // <-- export this
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