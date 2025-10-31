import React, { useEffect, useState } from 'react';
import { FaUsers, FaBookOpen, FaChartBar, FaCog } from 'react-icons/fa';
import API from '../api/axiosConfig';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeUsers: 0,
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsRes = await API.get('/admin/stats');
        setStats(statsRes.data);
        
        const usersRes = await API.get('/admin/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    };
    loadStats();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Stats Overview */}
      <section className="stats-grid">
        <div className="stat-card">
          <FaUsers className="icon" />
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaBookOpen className="icon" />
          <div className="stat-content">
            <h3>Total Quizzes</h3>
            <p className="stat-value">{stats.totalQuizzes}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <FaChartBar className="icon" />
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-value">{stats.activeUsers}</p>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="admin-section card">
        <h2>User Management</h2>
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="btn btn-small"
                      onClick={() => setSelectedUser(user)}
                    >
                      <FaCog /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}