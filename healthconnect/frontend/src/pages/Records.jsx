import React, { useEffect, useState } from 'react';
import api from '../api';

const FILE_ICONS = { pdf: '📄', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', doc: '📝', docx: '📝', txt: '📃' };
const fileIcon = (name) => FILE_ICONS[name?.split('.').pop()?.toLowerCase()] || '📎';
const fileUrl = (url) => `${process.env.REACT_APP_SOCKET_URL}${url}`;

export default function Records() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/records').then(r => setRecords(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      await api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg({ text: 'File uploaded successfully!', type: 'success' });
      setFile(null);
      e.target.reset();
      load();
    } catch {
      setMsg({ text: 'Upload failed. Please try again.', type: 'error' });
    } finally {
      setUploading(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
        <p className="text-gray-500 text-sm mt-1">Upload and manage your health documents</p>
      </div>

      {/* Upload card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Upload New Record</p>
        <form onSubmit={upload} className="flex flex-wrap gap-3 items-center">
          <label className="flex-1 min-w-48 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
            <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
            {file ? <span className="text-blue-600 font-medium">{fileIcon(file.name)} {file.name}</span>
                  : <span>📎 Click to choose a file</span>}
          </label>
          <button type="submit" disabled={!file || uploading} className="btn disabled:opacity-50 disabled:cursor-not-allowed">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {msg.text && (
          <p className={`mt-3 text-sm font-medium ${msg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>
        )}
      </div>

      {/* Records list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2 animate-pulse">📁</p>
          <p className="text-sm">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-5xl mb-4">🗂️</p>
          <p className="text-gray-700 font-semibold text-lg">No records yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload your first medical document above.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-700">{records.length} file{records.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {records.map(r => (
              <div key={r._id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{fileIcon(r.filename)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{r.filename}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={fileUrl(r.url)} target="_blank" rel="noreferrer"
                    className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                    View
                  </a>
                  <a href={fileUrl(r.url)} download={r.filename}
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                    ⬇ Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
