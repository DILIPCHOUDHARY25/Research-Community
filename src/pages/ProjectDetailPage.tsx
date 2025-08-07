import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function ProjectDetailPage() {
  const { id } = useParams();
  const { projects, applications, updateApplicationStatus } = useApp();
  const { user } = useAuth();
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const project = projects.find(p => p.id === id);
  // Get all applications for this project
  const projectApplications = applications.filter(app => app.projectId === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/projects" className="text-blue-600 hover:text-blue-500">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationMessage.trim()) return;

    setIsApplying(true);
    try {
      await applyToProject(project.id, applicationMessage);
      setHasApplied(true);
      setApplicationMessage('');
    } catch (error) {
      console.error('Failed to apply:', error);
    } finally {
      setIsApplying(false);
    }
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

  const getProjectTypeColor = (type: string) => {
    const colors = {
      'internship': 'bg-blue-100 text-blue-800',
      'collaboration': 'bg-green-100 text-green-800',
      'startup': 'bg-purple-100 text-purple-800',
      'hackathon': 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link 
        to="/projects"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{project.timeline}</span>
                </div>
                {project.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProjectTypeColor(project.type)}`}>
                {project.type}
              </span>
              {project.isRemote && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Remote OK
                </span>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">
                {project.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-semibold text-gray-900">{project.author.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(project.author.role)}`}>
                  {project.author.role}
                </span>
              </div>
              <p className="text-sm text-gray-600">{project.author.bio}</p>
              {/* Author Links */}
              <div className="flex items-center space-x-3 mt-2">
                {project.author.links.linkedin && (
                  <a 
                    href={project.author.links.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {project.author.links.github && (
                  <a 
                    href={project.author.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.author.links.website && (
                  <a 
                    href={project.author.links.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Connect
            </button>
          </div>

          {/* Project Description */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
            <div className="text-gray-700 whitespace-pre-wrap">
              {project.description}
            </div>
          </div>

          {/* Roles Needed */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Roles We're Looking For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.rolesNeeded.map((role, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Research Areas</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Owner: Applications Management */}
      {user && project && user.id === project.authorId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications to This Project</h2>
          {projectApplications.length === 0 ? (
            <p className="text-gray-600">No one has applied yet.</p>
          ) : (
            <ul className="space-y-4">
              {projectApplications.map((app) => (
                <li key={app.id} className="border-b last:border-b-0 pb-4">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{app.user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{app.user.name}</div>
                      <div className="text-xs text-gray-500">{app.user.email}</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-1 ${getRoleColor(app.user.role)}`}>{app.user.role}</span>
                    </div>
                    <span className={`ml-4 text-xs px-2 py-1 rounded-full ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : app.status === 'accepted' ? 'bg-green-100 text-green-800' : app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                  </div>
                  <div className="mb-2 text-gray-700"><span className="font-medium">Message:</span> {app.message}</div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                      disabled={app.status === 'accepted'}
                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                    >Accept</button>
                    <button
                      className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-medium hover:bg-yellow-600 disabled:opacity-50"
                      disabled={app.status === 'interview'}
                      onClick={() => updateApplicationStatus(app.id, 'interview')}
                    >Interview</button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                      disabled={app.status === 'rejected'}
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                    >Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Application Section */}
      {user && user.id !== project.authorId && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply to This Project</h2>
          
          {hasApplied ? (
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Application Submitted!</h3>
                <p className="text-sm text-green-700">The project owner will review your application and get back to you soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you interested in this project? What can you contribute?
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell the project owner about your background, relevant skills, and what excites you about this opportunity..."
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Your profile information will be shared with the project owner</span>
                </div>
                <button
                  type="submit"
                  disabled={isApplying || !applicationMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isApplying ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Interested in this project?</h3>
          <p className="text-blue-700 mb-4">Sign up or log in to apply and connect with the project owner.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
            <Link 
              to="/login" 
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}