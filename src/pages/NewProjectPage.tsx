import React, { useState, useRef, ChangeEvent, FormEvent, FocusEvent } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function NewProjectPage() {
  const { createProject } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  // Refs for focusing
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const requirementsRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);

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
    requirements: !requirements.trim() ? 'At least one requirement is required.' : '',
    budget: !budget.trim() ? 'Budget is required.' : '',
    duration: !duration.trim() ? 'Duration is required.' : '',
  };
  const isFormValid = Object.values(fieldErrors).every(e => !e);

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ title: true, description: true, requirements: true, budget: true, duration: true });
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
    if (fieldErrors.requirements) {
      requirementsRef.current?.focus();
      setLoading(false);
      return;
    }
    if (fieldErrors.budget) {
      budgetRef.current?.focus();
      setLoading(false);
      return;
    }
    if (fieldErrors.duration) {
      durationRef.current?.focus();
      setLoading(false);
      return;
    }

    const tagList = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    const requirementsList = requirements.split(',').map((r: string) => r.trim()).filter(Boolean);

    createProject({
      title: title.trim(),
      description: description.trim(),
      authorId: user.id,
      requirements: requirementsList,
      budget: budget.trim(),
      duration: duration.trim(),
      tags: tagList,
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
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={tags} onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)} placeholder="e.g. AI, Machine Learning, Biotech" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Requirements (comma separated)<span className="text-red-500">*</span></label>
          <input
            ref={requirementsRef}
            type="text"
            className={`w-full border ${touched.requirements && fieldErrors.requirements ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
            value={requirements}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRequirements(e.target.value)}
            onBlur={() => handleBlur('requirements')}
            placeholder="e.g. Python, TensorFlow, PhD in relevant field"
            required
          />
          {touched.requirements && fieldErrors.requirements && <div className="text-red-500 text-sm mt-1">{fieldErrors.requirements}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Budget<span className="text-red-500">*</span></label>
          <input
            ref={budgetRef}
            type="text"
            className={`w-full border ${touched.budget && fieldErrors.budget ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
            value={budget}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)}
            onBlur={() => handleBlur('budget')}
            placeholder="e.g. $50,000 - $100,000"
            required
          />
          {touched.budget && fieldErrors.budget && <div className="text-red-500 text-sm mt-1">{fieldErrors.budget}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration<span className="text-red-500">*</span></label>
          <input
            ref={durationRef}
            type="text"
            className={`w-full border ${touched.duration && fieldErrors.duration ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2`}
            value={duration}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
            onBlur={() => handleBlur('duration')}
            placeholder="e.g. 6-12 months"
            required
          />
          {touched.duration && fieldErrors.duration && <div className="text-red-500 text-sm mt-1">{fieldErrors.duration}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={location} onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} placeholder="e.g. Cambridge, MA" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remote" checked={isRemote} onChange={(e: ChangeEvent<HTMLInputElement>) => setIsRemote(e.target.checked)} />
          <label htmlFor="remote" className="text-sm font-medium">Remote OK</label>
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
