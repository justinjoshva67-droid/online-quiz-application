import React, { createContext, useState, useEffect } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          API.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          const res = await API.get('/auth/verify');
          if (res.data?.success) {
            setUser(res.data.user);
            setToken(savedToken);
          } else {
            throw new Error('Token verification failed');
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete API.defaults.headers.common['Authorization'];
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Clear loading state if no token
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        const res = await API.get('/auth/verify');
        
        if (!res.data || !res.data.user) {
          throw new Error('Invalid response from server');
        }

        // Update user state with verified data
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error('Auth verification failed:', err);
        // Clear everything on verification failure
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setLoading(false);
      }
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      const res = await API.post('/auth/login', { email, password });
      
      console.log('Login response:', res.data);
      
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Invalid credentials');
      }
      
      const { token: newToken, user: userData } = res.data.data;
      
      if (!userData || !newToken) {
        throw new Error('Invalid server response');
      }
      
      // Clear existing auth data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Set new data
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", newToken);
      
      setUser(userData);
      setToken(newToken);
      
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      // Clear any invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Invalid email or password'
      };
    }
  };

  const logout = () => {
    // Clear all auth-related state and storage
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear auth header
    delete API.defaults.headers.common['Authorization'];
    
    // Optional: Clear any other auth-related state here
    setLoading(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isAdmin = () => user?.role === 'admin';
  const isTeacher = () => user?.role === 'teacher';
  const isStudent = () => user?.role === 'student';

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      token, 
      login, 
      logout,
      theme,
      toggleTheme,
      loading,
      isAdmin,
      isTeacher,
      isStudent
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
