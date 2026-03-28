import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLoginLocal } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await adminLoginLocal(username, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid admin username or password');
      }
    } catch (err) {
      setError('Server error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon">🛡️</div>
          <h2>Admin Portal Access</h2>
          <p>Restricted area. Please sign in to verify credentials.</p>
        </div>

        {error && <div className="admin-error-msg">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required 
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required 
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Authorized Personnel Only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
