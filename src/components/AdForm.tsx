'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ad } from '@/lib/supabaseClient';

interface AdFormProps {
  initialData?: Partial<Ad>;
  onSubmit: (data: Omit<Ad, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  submitLabel: string;
}

export default function AdForm({ initialData, onSubmit, submitLabel }: AdFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    destination_url: initialData?.destination_url || '',
    status: (initialData?.status || 'active') as 'active' | 'inactive',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.destination_url.trim()) {
      newErrors.destination_url = 'Destination URL is required';
    } else if (!validateUrl(formData.destination_url)) {
      newErrors.destination_url = 'Please enter a valid URL (including http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error submitting form:', error);
      setErrors({ submit: `Failed to save ad: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-4 bg-red-900 border border-red-700 rounded text-red-300">
          {errors.submit}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-green-300 mb-2">
          Ad Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`w-full px-3 py-2 bg-black border rounded text-green-100 focus:outline-none focus:border-green-400 ${
            errors.title ? 'border-red-500' : 'border-green-800'
          }`}
          placeholder="Enter a compelling ad title"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-green-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`w-full px-3 py-2 bg-black border rounded text-green-100 focus:outline-none focus:border-green-400 resize-vertical ${
            errors.description ? 'border-red-500' : 'border-green-800'
          }`}
          placeholder="Describe your ad in detail..."
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="destination_url" className="block text-sm font-medium text-green-300 mb-2">
          Destination URL *
        </label>
        <input
          id="destination_url"
          type="url"
          value={formData.destination_url}
          onChange={(e) => handleChange('destination_url', e.target.value)}
          className={`w-full px-3 py-2 bg-black border rounded text-green-100 focus:outline-none focus:border-green-400 ${
            errors.destination_url ? 'border-red-500' : 'border-green-800'
          }`}
          placeholder="https://example.com"
          disabled={loading}
        />
        {errors.destination_url && (
          <p className="mt-1 text-sm text-red-400">{errors.destination_url}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-green-300 mb-2">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-100 focus:outline-none focus:border-green-400"
          disabled={loading}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-black font-medium py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2 border border-green-800 text-green-300 rounded hover:bg-green-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}