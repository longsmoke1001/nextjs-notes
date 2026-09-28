'use client';

import { useState } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface AddNoteProps {
  token: string;
  onNoteAdded: () => void;
}

export default function AddNote({ token, onNoteAdded }: AddNoteProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, category })
      });

      if (!response.ok) throw new Error('Add failed');

      setTitle('');
      setContent('');
      setCategory('general');
      onNoteAdded();

    } catch (err) {
      setError('Failed to add note. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-700 p-6 rounded-lg shadow-md mb-6 text-">
      <h3 className="text-xl font-bold mb-4">Add Note</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value='All'>All</option> 
            <option value="general">General</option>
            <option value="diary">Diary</option>
            <option value="password">Password</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </form>
    </div>
  );
}