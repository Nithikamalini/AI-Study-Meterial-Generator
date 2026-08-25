import { useState } from 'react';

const InteractiveQuiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) return <p>No questions available.</p>;

  const handleSelect = (option) => {
    if (showResults) return; // Prevent changing answer after submitting
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const q = questions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">Quiz Completed!</h3>
        <div className="text-center mb-8">
          <p className="text-4xl font-extrabold text-blue-600 mb-2">
            {score} / {questions.length}
          </p>
          <p className="text-gray-500">
            {score === questions.length ? 'Perfect score! Outstanding work!' : 
             score >= questions.length / 2 ? 'Good job! Keep practicing.' : 
             'Keep studying, you will get it next time!'}
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <h4 className="font-semibold text-lg border-b pb-2">Review your answers:</h4>
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={idx} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="font-semibold text-gray-900 mb-2">{idx + 1}. {question.question}</p>
                <p className="text-sm mb-1">
                  <span className="font-medium text-gray-700">Your Answer:</span>{' '}
                  <span className={isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {userAnswer || 'Skipped'}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm mb-2">
                    <span className="font-medium text-gray-700">Correct Answer:</span>{' '}
                    <span className="text-green-700 font-medium">{question.correctAnswer}</span>
                  </p>
                )}
                {question.explanation && (
                  <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                    <span className="font-semibold text-gray-800">Explanation:</span> {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Interactive Quiz
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-6">{q.question}</h3>

      <div className="space-y-3">
        {q.options?.map((opt, i) => {
          const isSelected = selectedAnswers[currentQuestionIndex] === opt;
          return (
            <div
              key={i}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{opt}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveQuiz;
