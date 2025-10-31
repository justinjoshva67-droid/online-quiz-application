import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Add validation
      if (!form.email || !form.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const result = await login(form.email, form.password);
      
      if (result.success) {
        // Login successful, AuthContext will handle the user state
        console.log('Login successful');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container card">
      <h2 className="text-center mb-4">Login to QuizLab</h2>
      {error && (
        <div className="error-message bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
            placeholder="Enter your password"
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full btn btn-primary p-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
      </p>
    </div>
  );
}
