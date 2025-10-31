import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axiosConfig';

const DemoQuiz = () => {
  const { user } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load demo quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await API.get('/quiz/demo');
        setQuiz(response.data.data);
        setTimeLeft(response.data.data.timeLimitMinutes * 60);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz');
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!quiz || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, quizCompleted]);

  const handleAnswer = (answerIndex) => {
    if (quizCompleted) return;
    
    setSelectedAnswer(answerIndex);
    
    // Check if answer is correct
    if (quiz.questions[currentQuestion].correctAnswer === answerIndex) {
      setScore(prev => prev + quiz.questions[currentQuestion].marks);
    }

    // Move to next question or complete quiz
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="text-center p-4">Loading quiz...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!quiz) return <div className="text-center p-4">No quiz available</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between mb-4">
          <div className="font-bold text-lg">Demo Quiz</div>
          <div className="text-blue-600">Time: {formatTime(timeLeft)}</div>
        </div>

        {!quizCompleted ? (
          <>
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
              <div className="text-lg mb-4">
                {quiz.questions[currentQuestion].question}
              </div>
              <div className="grid gap-3">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 rounded-lg border text-left transition-colors
                      ${selectedAnswer === null 
                        ? 'hover:bg-blue-50' 
                        : selectedAnswer === index
                          ? index === quiz.questions[currentQuestion].correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : 'bg-red-100 border-red-500'
                          : 'opacity-50'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Quiz Completed!</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              Score: {score}/{quiz.questions.reduce((acc, q) => acc + q.marks, 0)}
            </div>
            <div className="text-gray-600">
              ({Math.round((score / quiz.questions.reduce((acc, q) => acc + q.marks, 0)) * 100)}%)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoQuiz;