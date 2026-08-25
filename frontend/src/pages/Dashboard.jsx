import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckSquare, BrainCircuit, Plus } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      setIsUploading(true);
      try {
        const { data } = await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setDocuments([data, ...documents]);
      } catch (error) {
        console.error('Failed to upload document', error);
        alert('Failed to upload document. Make sure it is a valid PDF.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        
        <div>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Upload PDF
          </label>
          <input id="file-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
        </div>
      </div>

      {isUploading && (
        <div className="mb-8 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Processing your document...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg"><FileText className="text-blue-600 w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Documents</p>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg"><CheckSquare className="text-green-600 w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Quizzes Taken</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg"><BrainCircuit className="text-purple-600 w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Flashcards</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Documents</h2>
      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
          <p className="mt-1 text-gray-500 mb-6">Get started by uploading your first study material.</p>
          <label htmlFor="file-upload-empty" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload PDF
          </label>
          <input id="file-upload-empty" type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc._id} className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-2 rounded"><FileText className="text-red-600 w-5 h-5" /></div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.originalName || doc.name}</p>
                    <p className="text-sm text-gray-500">Uploaded on {new Date(doc.createdAt || doc.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <a href={`/document/${doc._id || doc.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Materials</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
