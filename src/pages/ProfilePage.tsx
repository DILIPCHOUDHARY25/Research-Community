import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { User as UserIcon, Mail, MapPin, Calendar, ExternalLink, Github, Linkedin, Globe, Edit3, Save, X } from 'lucide-react';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { projects, applications } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    links: user?.links || {},
    preferences: user?.preferences || {
      wantToHire: false,
      wantToJoin: true,
      wantToCollaborate: true,
      remote: true,
      onSite: true,
    },
  });

  const interestOptions = [
    'AI', 'Machine Learning', 'Computer Vision', 'NLP', 'Robotics',
    'Biotech', 'Drug Discovery', 'Genomics', 'Healthcare',
    'Quantum Computing', 'Physics', 'Mathematics',
    'Climate Tech', 'Sustainability', 'Clean Energy',
    'Fintech', 'Blockchain', 'Cybersecurity',
    'Materials Science', 'Nanotechnology',
    'Psychology', 'Neuroscience', 'Cognitive Science',
  ];

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      interests: user?.interests || [],
      links: user?.links || {},
      preferences: user?.preferences || {
        wantToHire: false,
        wantToJoin: true,
        wantToCollaborate: true,
        remote: true,
        onSite: true,
      },
    });
    setIsEditing(false);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'student': 'bg-green-100 text-green-800',
      'researcher': 'bg-blue-100 text-blue-800',
      'founder': 'bg-purple-100 text-purple-800',
      'professor': 'bg-orange-100 text-orange-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPreferenceBadges = () => {
    if (!user) return [];
    const badges = [];
    if (user.preferences.wantToHire) badges.push('Looking to Hire');
    if (user.preferences.wantToJoin) badges.push('Open to Opportunities');
    if (user.preferences.wantToCollaborate) badges.push('Open to Collaborate');
    return badges;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h1>
      </div>
    );
  }

  // Projects posted by the user
  const postedProjects = projects.filter(p => p.authorId === user.id);
  // Applications by the user
  const myApplications = applications.filter(app => app.userId === user.id);
  // Projects the user applied to
  const appliedProjects = myApplications.map(app => {
    const project = projects.find(p => p.id === app.projectId);
    return project ? { project, application: app } : null;
  }).filter(Boolean) as { project: typeof projects[0], application: typeof applications[0] }[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
        <div className="p-8">
          <div className="flex items-start justify-between -mt-16 mb-6">
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-gray-600" />
              </div>
              <div className="pb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                )}
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleCancel}
                className="ml-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Tell us about yourself, your research interests, and what you're looking for..."
                />
              ) : (
                <p className="text-gray-700">{user.bio}</p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Preferences</h2>
              <div className="space-y-2">
                {getPreferenceBadges().map((badge) => (
                  <span key={badge} className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-1">
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Interests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Interests</h2>
        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  formData.interests.includes(interest)
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span key={interest} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={formData.links.linkedin || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    links: { ...prev.links, linkedin: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="url"
                  value={formData.links.github || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    links: { ...prev.links, github: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.links.website || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    links: { ...prev.links, website: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {user.links.linkedin && (
                <a 
                  href={user.links.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {user.links.github && (
                <a 
                  href={user.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {user.links.website && (
                <a 
                  href={user.links.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preferences */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What are you looking for?</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.wantToJoin}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, wantToJoin: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">I want to join projects</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.wantToCollaborate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, wantToCollaborate: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">I want to collaborate on research</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.wantToHire}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, wantToHire: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">I want to hire or recruit talent</span>
            </label>
          </div>
        </div>
      )}

      {/* User's Projects & Applications Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Posted Projects</h2>
        {postedProjects.length === 0 ? (
          <p className="text-gray-600">You haven't posted any projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {postedProjects.map(project => (
              <li key={project.id} className="border-b last:border-b-0 pb-2">
                <span className="font-medium text-blue-700">{project.title}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{project.type}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full {project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}">{project.isActive ? 'Active' : 'Inactive'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects You've Applied To</h2>
        {appliedProjects.length === 0 ? (
          <p className="text-gray-600">You haven't applied to any projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {appliedProjects.map(({ project, application }) => (
              <li key={project.id} className="border-b last:border-b-0 pb-2">
                <span className="font-medium text-blue-700">{project.title}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{project.type}</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : application.status === 'accepted' ? 'bg-green-100 text-green-800' : application.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                {application.status === 'accepted' && (
                  <span className="ml-2 text-green-700 text-xs">Congratulations! You have been accepted.</span>
                )}
                {application.status === 'rejected' && (
                  <span className="ml-2 text-red-700 text-xs">Sorry, your application was not successful.</span>
                )}
                {application.status === 'interview' && (
                  <span className="ml-2 text-yellow-700 text-xs">You have been shortlisted for an interview!</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}