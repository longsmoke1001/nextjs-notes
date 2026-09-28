'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import AddNote from '@/components/AddNote';
import EditNote from '@/components/EditNote';

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [category, setCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
      return;
    }
    setToken(savedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchNotes = async () => {
      try {
        const response = await fetch(

          (category === 'All' ? `${API_BASE_URL}/api/Notes?pageNumber=${pageNumber}&pageSize=10` : `${API_BASE_URL}/api/Notes/category/${category}?pageNumber=${pageNumber}&pageSize=10`),
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = await response.json();
        setNotes(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Fetch notes error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token, pageNumber, refreshKey, category]);
  const handleNoteAdded = () => {
    setRefreshKey(prev => prev + 1);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed');
    }
  };
  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <AddNote token={token!} onNoteAdded={handleNoteAdded} />
      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-2xl font-bold mb-4">My Notes</h2>
        <select className="border bg-gray-200 border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="general">General</option>
            <option value="diary">Diary</option>
            <option value="password">Password</option>
        </select>
      </div>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            editingId === note.id ? (
              <li key={note.id} className="bg-white p-5 rounded-lg shadow-sm">
                <EditNote
                  token={token!}
                  note={note}
                  onNoteUpdated={() => {
                    setEditingId(null);
                    setRefreshKey(prev => prev + 1);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li key={note.id} className="bg-white p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2 text-lg font-semibold text-slate-800">
                  <h3>
                    {note.title}
                  </h3>
                  <span>
                    {note.category}
                  </span>
                </div>
                <p className="text-slate-800 whitespace-pre-wrap">{note.content}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(note.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )))}
        </ul>
      )}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {pageNumber} of {totalPages}
        </span>

        <button
          onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
          disabled={pageNumber === totalPages}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}