import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaBookOpen } from 'react-icons/fa';
import API from '../api/axiosConfig';

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'general',
    timeLimitMinutes: 30,
    questions: []
  });

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const [coursesRes, quizzesRes] = await Promise.all([
          API.get('/teacher/courses'),
          API.get('/teacher/quizzes')
        ]);
        setCourses(coursesRes.data);
        setQuizzes(quizzesRes.data);
      } catch (err) {
        console.error('Failed to load teacher data:', err);
      }
    };
    loadTeacherData();
  }, []);

  const handleCreateQuiz = async () => {
    try {
      const res = await API.post('/quiz', newQuiz);
      setQuizzes([...quizzes, res.data]);
      setIsCreating(false);
      setNewQuiz({
        title: '',
        description: '',
        category: 'general',
        timeLimitMinutes: 30,
        questions: []
      });
    } catch (err) {
      console.error('Failed to create quiz:', err);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await API.delete(`/quiz/${quizId}`);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  return (
    <div className="teacher-dashboard">
      {/* Course Overview */}
      <section className="courses-section card">
        <div className="section-header">
          <h2>My Courses</h2>
          <button className="btn btn-primary">
            <FaPlus /> Add Course
          </button>
        </div>

        <div className="course-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-icon">
                <FaBookOpen />
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span>{course.students?.length || 0} Students</span>
                <span>{course.quizzes?.length || 0} Quizzes</span>
              </div>
              <div className="course-actions">
                <button className="btn btn-outline">
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz Management */}
      <section className="quizzes-section card">
        <div className="section-header">
          <h2>My Quizzes</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <FaPlus /> Create Quiz
          </button>
        </div>

        {isCreating && (
          <div className="create-quiz-form card">
            <h3>Create New Quiz</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newQuiz.title}
                onChange={e => setNewQuiz({...newQuiz, title: e.target.value})}
                placeholder="Quiz title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newQuiz.description}
                onChange={e => setNewQuiz({...newQuiz, description: e.target.value})}
                placeholder="Quiz description"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newQuiz.category}
                onChange={e => setNewQuiz({...newQuiz, category: e.target.value})}
              >
                <option value="general">General</option>
                <option value="programming">Programming</option>
                <option value="science">Science</option>
                <option value="math">Mathematics</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                value={newQuiz.timeLimitMinutes}
                onChange={e => setNewQuiz({...newQuiz, timeLimitMinutes: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setIsCreating(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateQuiz}>
                Create Quiz
              </button>
            </div>
          </div>
        )}

        <div className="quiz-list">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-item">
              <div className="quiz-info">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                  <span>{quiz.category}</span>
                  <span>{quiz.timeLimitMinutes} minutes</span>
                  <span>{quiz.questions?.length || 0} questions</span>
                </div>
              </div>
              <div className="quiz-actions">
                <button className="btn btn-outline">
                  <FaEdit /> Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}