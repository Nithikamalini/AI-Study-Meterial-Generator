import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, FileText, CheckSquare, List, ListOrdered } from 'lucide-react';
import api from '../api';
import InteractiveQuiz from '../components/InteractiveQuiz';

const generationOptions = [
  { id: 'summary', title: 'Summary', icon: <FileText className="w-5 h-5" />, desc: 'Condense into key points' },
  { id: 'mcqs', title: 'Multiple Choice', icon: <CheckSquare className="w-5 h-5" />, desc: 'Practice with MCQs' },
  { id: 'flashcards', title: 'Flashcards', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Key terms and definitions' },
  { id: 'short-questions', title: 'Short Q&A', icon: <List className="w-5 h-5" />, desc: 'Brief questions with answers' },
  { id: 'long-questions', title: 'Long Q&A', icon: <ListOrdered className="w-5 h-5" />, desc: 'Essay-style questions' },
];

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const { data } = await api.get(`/documents/${id}`);
      setDocumentInfo(data);
    } catch (error) {
      console.error('Failed to fetch document', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data } = await api.post('/study-materials/generate', {
        documentId: id,
        type: selectedOption
      });
      setGeneratedResult({
        type: data.type,
        content: data.content
      });
    } catch (error) {
      console.error('Generation failed', error);
      alert('Failed to generate study material. Ensure backend has Gemini API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = (type, content) => {
    if (typeof content === 'string') {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    if (type === 'mcqs' || type === 'quiz') {
      return <InteractiveQuiz questions={Array.isArray(content) ? content : []} />;
    }

    if (type === 'flashcards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(content) && content.map((card, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-40 group hover:shadow-md transition-all">
              <div className="text-center font-semibold text-blue-900 mb-2">{card.front}</div>
              <div className="text-center text-sm text-gray-600 border-t pt-2 opacity-0 group-hover:opacity-100 transition-opacity">{card.back}</div>
              <div className="text-center text-xs text-gray-400 mt-2 group-hover:hidden">Hover to reveal</div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'short-questions' || type === 'long-questions') {
      return (
        <div className="space-y-6">
          {Array.isArray(content) && content.map((q, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">Q: {q.question}</p>
              <div className="text-gray-700 bg-gray-50 p-3 rounded text-sm">
                <span className="font-semibold block mb-1">Answer:</span>
                {q.answer}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (type === 'important-topics') {
      return (
        <ul className="list-disc pl-5 space-y-2">
          {Array.isArray(content) && content.map((topic, idx) => (
            <li key={idx} className="text-gray-700">{topic}</li>
          ))}
        </ul>
      );
    }

    return <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(content, null, 2)}</pre>;
  };

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 flex items-center gap-2 text-sm font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{documentInfo ? documentInfo.originalName : 'Loading...'}</h1>
        <p className="text-gray-500">Uploaded on {documentInfo ? new Date(documentInfo.createdAt).toLocaleDateString() : '...'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Generation options */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Generate Material</h2>
            <div className="space-y-3">
              {generationOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedOption === opt.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <div className={`mt-0.5 ${selectedOption === opt.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {opt.icon}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${selectedOption === opt.id ? 'text-blue-900' : 'text-gray-900'}`}>{opt.title}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                'Generate Now'
              )}
            </button>
          </div>
        </div>

        {/* Right side - Results */}
        <div className="lg:col-span-2">
          {generatedResult ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="bg-gray-50 border-b border-gray-200 p-4 shrink-0">
                <h3 className="font-semibold text-gray-900 capitalize flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  Generated {generatedResult.type.replace('-', ' ')}
                </h3>
              </div>
              <div className="p-6 text-gray-700 overflow-y-auto flex-1">
                {renderContent(generatedResult.type, generatedResult.content)}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <BrainCircuit className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Ready to Generate</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Select an option from the left and click "Generate Now" to create study materials from your document using AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentView;
