import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ProjectType } from '../types';
import { useNavigate } from 'react-router-dom';

const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: 'internship', label: 'Internship' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'startup', label: 'Startup' },
  { id: 'hackathon', label: 'Hackathon' },
];

export function NewProjectPage() {
  const { createProject } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('internship');
  const [tags, setTags] = useState<string>('');
  const [timeline, setTimeline] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [rolesNeeded, setRolesNeeded] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">You must be logged in to post a project.</h1>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!title.trim() || !description.trim() || !timeline.trim() || !rolesNeeded.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    const rolesList = rolesNeeded.split(',').map(r => r.trim()).filter(Boolean);

    createProject({
      title: title.trim(),
      description: description.trim(),
      authorId: user.id,
      timeline: timeline.trim(),
      rolesNeeded: rolesList,
      type,
      tags: tagList,
      isActive,
      location: location.trim() || undefined,
      isRemote,
    });
    setSuccess('Project posted successfully!');
    setLoading(false);
    setTimeout(() => {
      navigate('/projects');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Post a New Project</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6 border border-gray-200">
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Title<span className="text-red-500">*</span></label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description<span className="text-red-500">*</span></label>
          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px]" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project Type</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={type} onChange={e => setType(e.target.value as ProjectType)}>
            {PROJECT_TYPES.map(pt => (
              <option key={pt.id} value={pt.id}>{pt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. AI, Machine Learning, Biotech" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timeline<span className="text-red-500">*</span></label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={timeline} onChange={e => setTimeline(e.target.value)} required placeholder="e.g. 6 months" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Cambridge, MA" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remote" checked={isRemote} onChange={e => setIsRemote(e.target.checked)} />
          <label htmlFor="remote" className="text-sm font-medium">Remote OK</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Roles Needed (comma separated)<span className="text-red-500">*</span></label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={rolesNeeded} onChange={e => setRolesNeeded(e.target.value)} placeholder="e.g. ML Engineer, Research Intern" required />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
          <label htmlFor="active" className="text-sm font-medium">Project is Active</label>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors" disabled={loading}>
          {loading ? 'Posting...' : 'Post Project'}
        </button>
      </form>
    </div>
  );
}
