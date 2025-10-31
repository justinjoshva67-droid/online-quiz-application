import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaStar, FaTrophy } from 'react-icons/fa';
import '../styles/quiz-card.css';

// Helper function to get category image
const getCategoryImage = (category) => {
  const images = {
    'programming': '/images/programming.jpg',
    'science': '/images/science.jpg',
    'math': '/images/math.jpg',
    'general': '/images/general.jpg',
  };
  return images[category?.toLowerCase()] || '/images/default-quiz.jpg';
};

export default function QuizCard({ quiz }) {
  return (
    <article className="card quiz-card">
      <div className="quiz-image">
        <img src={getCategoryImage(quiz.category)} alt={quiz.title} />
        {quiz.difficulty && (
          <div className={`difficulty-badge ${quiz.difficulty.toLowerCase()}`}>
            <FaStar className="icon" />
            {quiz.difficulty}
          </div>
        )}
      </div>

      <div className="quiz-main">
        <h3 className="quiz-title">{quiz.title}</h3>
        <p className="quiz-desc">{quiz.description}</p>

        <div className="quiz-stats">
          <div className="stat">
            <FaClock className="icon" />
            <span>{quiz.timeLimitMinutes}m</span>
          </div>
          <div className="stat">
            <FaQuestionCircle className="icon" />
            <span>{quiz.questions?.length || 0} Questions</span>
          </div>
          {quiz.highScore && (
            <div className="stat">
              <FaTrophy className="icon" />
              <span>Best: {quiz.highScore}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="quiz-actions">
        <Link to={`/quiz/${quiz._id}`} className="btn btn-primary">
          Take Quiz
        </Link>
      </div>
    </article>
  );
}