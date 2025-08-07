import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { Search, Filter, MapPin, MessageSquare, ExternalLink, Github, Linkedin, Globe, Users, Briefcase } from 'lucide-react';

export function DiscoverPage() {
  const { users } = useApp();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPreference, setSelectedPreference] = useState('');

  const roles = [
    { id: 'student', label: 'Student' },
    { id: 'researcher', label: 'Independent Researcher' },
    { id: 'founder', label: 'Startup Founder' },
    { id: 'professor', label: 'Professor/Mentor' },
  ];

  const preferences = [
    { id: 'wantToHire', label: 'Looking to Hire' },
    { id: 'wantToJoin', label: 'Looking to Join Projects' },
    { id: 'wantToCollaborate', label: 'Open to Collaboration' },
  ];

  const allInterests = Array.from(new Set(users.flatMap(u => u.interests)));

  const filteredUsers = users.filter(user => {
    // Don't show current user
    if (currentUser && user.id === currentUser.id) return false;

    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.interests.some(interest => 
                           interest.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesRole = !selectedRole || user.role === selectedRole;
    
    const matchesInterests = selectedInterests.length === 0 || 
                           selectedInterests.some(interest => user.interests.includes(interest));

    const matchesPreference = !selectedPreference || 
                             user.preferences[selectedPreference as keyof typeof user.preferences];

    return matchesSearch && matchesRole && matchesInterests && matchesPreference;
  });

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
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

  const getPreferenceBadges = (user: User) => {
    const badges = [];
    if (user.preferences.wantToHire) badges.push('Looking to Hire');
    if (user.preferences.wantToJoin) badges.push('Open to Opportunities');
    if (user.preferences.wantToCollaborate) badges.push('Open to Collaborate');
    return badges;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Researchers</h1>
        <p className="text-gray-600 mt-2">Connect with talented individuals in your field</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="space-y-6">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, bio, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Role</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value=""
                    checked={selectedRole === ''}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">All Roles</span>
                </label>
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedRole === role.id}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preference Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Looking For</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preference"
                    value=""
                    checked={selectedPreference === ''}
                    onChange={(e) => setSelectedPreference(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Any</span>
                </label>
                {preferences.map((pref) => (
                  <label key={pref.id} className="flex items-center">
                    <input
                      type="radio"
                      name="preference"
                      value={pref.id}
                      checked={selectedPreference === pref.id}
                      onChange={(e) => setSelectedPreference(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{pref.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interests Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Interests</h3>
              <div className="max-h-40 overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  {allInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-2 py-1 rounded-md text-xs transition-colors ${
                        selectedInterests.includes(interest)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredUsers.length} researchers
        </p>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} mt-1`}>
                  {user.role}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {user.bio}
            </p>

            {/* Interests */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Research Interests</h4>
              <div className="flex flex-wrap gap-1">
                {user.interests.slice(0, 3).map((interest) => (
                  <span key={interest} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                    {interest}
                  </span>
                ))}
                {user.interests.length > 3 && (
                  <span className="text-gray-500 text-xs">+{user.interests.length - 3} more</span>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {getPreferenceBadges(user).slice(0, 2).map((badge) => (
                  <span key={badge} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {user.links.linkedin && (
                  <a 
                    href={user.links.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {user.links.github && (
                  <a 
                    href={user.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {user.links.website && (
                  <a 
                    href={user.links.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>Connect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No researchers found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or{' '}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('');
                setSelectedInterests([]);
                setSelectedPreference('');
              }}
              className="text-blue-600 hover:text-blue-500 underline"
            >
              clear all filters
            </button>
          </p>
        </div>
      )}
    </div>
  );
}