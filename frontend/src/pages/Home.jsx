import { Link } from 'react-router-dom';
import { FileText, BrainCircuit, CheckSquare } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
          Transform Your Notes into <span className="text-blue-600">Smart Study Materials</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your PDFs and let AI generate summaries, quizzes, flashcards, and important topics instantly. Supercharge your learning process.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
          >
            Get Started for Free
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
          >
            Login to Account
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-blue-600 h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Summaries</h3>
            <p className="text-gray-600">Condense long lectures and textbooks into concise, easy-to-read notes.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckSquare className="text-green-600 h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Practice Quizzes</h3>
            <p className="text-gray-600">Test your knowledge with auto-generated multiple choice and short answer questions.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BrainCircuit className="text-purple-600 h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Flashcards</h3>
            <p className="text-gray-600">Memorize key concepts faster with AI-extracted flashcard decks.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
