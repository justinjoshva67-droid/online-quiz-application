import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./styles/loading.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import QuizPage from "./components/QuizPage";
import ResultPage from "./components/ResultPage";
import Leaderboard from "./components/Leaderboard";
import Analytics from "./components/Analytics";
import DemoQuiz from "./components/DemoQuiz";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(AuthContext);
  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};

const AuthLinks = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user) {
    return (
      <div className="auth-links">
        <span className="user-info">{user.name}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-links">
      <Link to="/login" className="btn-login">Login</Link>
      <Link to="/register" className="btn-register">Register</Link>
    </div>
  );
};

const AppRoutes = () => {
  const { user, theme, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const getHomeComponent = () => {
    // Skip login check and go straight to appropriate dashboard
    if (user?.role === 'admin') return <AdminDashboard />;
    if (user?.role === 'teacher') return <TeacherDashboard />;
    return <Dashboard />;
  };

  return (
    <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <Link to="/" className="logo">Quiz<span className="logo-accent">Lab</span></Link>
            <p className="tag">Online Quiz Application</p>
          </div>
          <nav className="main-nav">
            {!user && <Link to="/demo-quiz" className="nav-link">Try Demo Quiz</Link>}
            {user && (
              <>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
                {(user.role === 'admin' || user.role === 'teacher') && (
                  <Link to="/analytics" className="nav-link">Analytics</Link>
                )}
              </>
            )}
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <AuthLinks />
          </div>
        </div>
      </header>

      <main className="container app-container">
        <Routes>
          <Route path="/" element={getHomeComponent()} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demo-quiz" element={<DemoQuiz />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute roles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/:id" 
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute roles={['admin', 'teacher']}>
                <Analytics />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div>Loading...</div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;