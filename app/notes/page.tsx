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
          `${API_BASE_URL}/api/Notes?pageNumber=${pageNumber}&pageSize=10`,
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
  }, [token, pageNumber, refreshKey]);
  const handleNoteAdded = () => {
    setRefreshKey(prev => prev + 1);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('確定刪除呢個筆記？')) return;

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
      alert('刪除失敗');
    }
  };
  if (loading) return <p className="text-center py-10 text-gray-500">載入中...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <AddNote token={token!} onNoteAdded={handleNoteAdded} />
      <h2 className="text-2xl font-bold mb-4">我的筆記</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500">暫時冇筆記</p>
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
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{note.title}</h3>
                <p className="text-gray-600">{note.content}</p>
                <div className="flex gap-2">
                  <button
                  onClick={() => setEditingId(note.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm transition"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition"
                >
                  刪除
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
          上一頁
        </button>

        <span className="text-gray-700">第 {pageNumber} / {totalPages} 頁</span>

        <button
          onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
          disabled={pageNumber === totalPages}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          下一頁
        </button>
      </div>
    </div>
  );
}