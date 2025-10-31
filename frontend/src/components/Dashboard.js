import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  FaSearch, 
  FaPlus, 
  FaTrophy, 
  FaChartBar, 
  FaBookOpen, 
  FaUserGraduate, 
  FaClock 
} from "react-icons/fa";
import QuizCard from "./QuizCard";
import "../styles/dashboard.css";
import "../styles/quiz.css";
export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTime: 0
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { user, logout, toggleTheme } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await API.get(`/quiz?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
        setQuizzes(res.data.data.quizzes || []);
      } catch (err) {
        console.error(err);
      }
    };

    const loadStats = async () => {
      if (!user) return;
      try {
        const res = await API.get('/result/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    loadQuizzes();
    loadStats();
  }, [page, search, user]);

  const goCreate = async () => {
    if (!user || user.role !== "admin") return alert("Admin only");
    const title = prompt("Quiz title");
    if (!title) return;
    const sample = { 
      title, 
      description: "Created from dashboard", 
      questions: [{ 
        question: "Sample Question", 
        options: ["Option A", "Option B", "Option C", "Option D"], 
        correctAnswer: 0 
      }] 
    };
    try {
      await API.post("/quiz", sample);
      window.location.reload();
    } catch (err) {
      alert('Failed to create quiz');
    }
  };

  return (
    <div className="dashboard">
      <section className="hero">
        <div className="hero-left">
          <h1 className="app-title">Welcome to QuizLab</h1>
          <p className="subtitle">
            {user 
              ? `Ready for your next challenge, ${user.name}? Explore our quizzes and test your knowledge!`
              : 'Practice, compete and improve — quick quizzes for every topic.'}
          </p>
        </div>
        <div className="hero-actions">
          {user ? (
            <div className="user-block">
              <span className="user-greet">Hi, {user.name}</span>
              <button className="btn btn-ghost" onClick={() => { logout(); nav('/login'); }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-ghost">Register</Link>
            </div>
          )}
        </div>
      </section>

      {user && (
        <section className="stats-grid">
          <div className="stat-card">
            <FaBookOpen className="icon" />
            <div className="stat-value">{stats.totalQuizzes}</div>
            <div className="stat-label">Available Quizzes</div>
          </div>
          <div className="stat-card">
            <FaUserGraduate className="icon" />
            <div className="stat-value">{stats.completedQuizzes}</div>
            <div className="stat-label">Completed Quizzes</div>
          </div>
          <div className="stat-card">
            <FaTrophy className="icon" />
            <div className="stat-value">{stats.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <FaClock className="icon" />
            <div className="stat-value">{Math.round(stats.totalTime / 60)}</div>
            <div className="stat-label">Minutes Spent</div>
          </div>
        </section>
      )}

      <section className="controls">
        <div className="actions">
          {user?.role === "admin" && (
            <button className="btn btn-primary" onClick={goCreate}>
              <FaPlus className="icon" /> Create Quiz
            </button>
          )}
          <Link to="/results" className="btn btn-ghost">
            <FaTrophy className="icon" /> My Results
          </Link>
          <Link to="/leaderboard" className="btn btn-ghost">
            <FaChartBar className="icon" /> Leaderboard
          </Link>
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <Link to="/analytics" className="btn btn-ghost">
              <FaChartBar className="icon" /> Analytics
            </Link>
          )}
        </div>

        <div className="search">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              placeholder="Search quizzes by title or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="quiz-grid">
        {quizzes.length === 0 ? (
          <div className="empty-state">
            <FaSearch className="icon" />
            <p>No quizzes found — try a different search.</p>
          </div>
        ) : (
          quizzes.map(quiz => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))
        )}
      </section>
    </div>
  );
}
