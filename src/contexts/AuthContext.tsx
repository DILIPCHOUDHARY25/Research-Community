import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demonstration
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
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // Mock signup - in real app, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      role: userData.role!,
      bio: userData.bio || '',
      interests: userData.interests || [],
      links: userData.links || {},
      preferences: userData.preferences || {
        wantToHire: false,
        wantToJoin: true,
        wantToCollaborate: true,
        remote: true,
        onSite: true,
      },
      createdAt: new Date(),
      lastActive: new Date(),
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}