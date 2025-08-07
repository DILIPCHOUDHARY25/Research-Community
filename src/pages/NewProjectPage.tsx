import React, { useState, useRef, ChangeEvent, FormEvent, FocusEvent } from 'react';
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

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<ProjectType>('internship');
  const [tags, setTags] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [rolesNeeded, setRolesNeeded] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Refs for focusing
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const timelineRef = useRef<HTMLInputElement>(null);
  const rolesRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">You must be logged in to post a project.</h1>
      </div>
    );
  }

  // Validation logic
  const fieldErrors = {
    title: !title.trim() ? 'Title is required.' : '',
    description: !description.trim() ? 'Description is required.' : '',
    timeline: !timeline.trim() ? 'Timeline is required.' : '',
    rolesNeeded: !rolesNeeded.trim() ? 'At least one role is required.' : '',
  };
  const isFormValid = Object.values(fieldErrors).every(e => !e);

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ title: true, description: true, timeline: true, rolesNeeded: true });
    setLoading(true);

    // Focus first invalid field
    if (fieldErrors.title) {
      titleRef.current?.focus();
      setLoading(false);
      return;
    }
    if (fieldErrors.description) {
      descriptionRef.current?.focus();
      setLoading(false);
      return;
    }
    if (fieldErrors.timeline) {
      timelineRef.current?.focus();
      setLoading(false);
      return;
    }
    if (fieldErrors.rolesNeeded) {
      rolesRef.current?.focus();
      setLoading(false);
      return;
    }

    const tagList = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    const rolesList = rolesNeeded.split(',').map((r: string) => r.trim()).filter(Boolean);

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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6 border border-gray-200" noValidate>
        {error && <div className="text-red-600 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Title<span className="text-red-500">*</span></label>
          <input
            ref={titleRef}
            type="text"
            className={`w-full border ${touched.title && fieldErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            onBlur={() => handleBlur('title')}
            required
          />
          {touched.title && fieldErrors.title && <div className="text-red-500 text-sm mt-1">{fieldErrors.title}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description<span className="text-red-500">*</span></label>
          <textarea
            ref={descriptionRef}
            className={`w-full border ${touched.description && fieldErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 min-h-[100px]`}
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            required
          />
          {touched.description && fieldErrors.description && <div className="text-red-500 text-sm mt-1">{fieldErrors.description}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project Type</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={type} onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value as ProjectType)}>
            {PROJECT_TYPES.map((pt) => (
              <option key={pt.id} value={pt.id}>{pt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={tags} onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)} placeholder="e.g. AI, Machine Learning, Biotech" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timeline<span className="text-red-500">*</span></label>
          <input
            ref={timelineRef}
            type="text"
            className={`w-full border ${touched.timeline && fieldErrors.timeline ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
            value={timeline}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeline(e.target.value)}
            onBlur={() => handleBlur('timeline')}
            required
            placeholder="e.g. 6 months"
          />
          {touched.timeline && fieldErrors.timeline && <div className="text-red-500 text-sm mt-1">{fieldErrors.timeline}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={location} onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} placeholder="e.g. Cambridge, MA" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remote" checked={isRemote} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsRemote(e.target.checked)} />
          <label htmlFor="remote" className="text-sm font-medium">Remote OK</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Roles Needed (comma separated)<span className="text-red-500">*</span></label>
          <input
            ref={rolesRef}
            type="text"
            className={`w-full border ${touched.rolesNeeded && fieldErrors.rolesNeeded ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
            value={rolesNeeded}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRolesNeeded(e.target.value)}
            onBlur={() => handleBlur('rolesNeeded')}
            placeholder="e.g. ML Engineer, Research Intern"
            required
          />
          {touched.rolesNeeded && fieldErrors.rolesNeeded && <div className="text-red-500 text-sm mt-1">{fieldErrors.rolesNeeded}</div>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={isActive} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsActive(e.target.checked)} />
          <label htmlFor="active" className="text-sm font-medium">Project is Active</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Posting...' : 'Post Project'}
        </button>
      </form>
    </div>
  );
}
