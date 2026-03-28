import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth(); // login from AuthContext still handles the actual redirect

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to <span style={{color: '#2563eb'}}>EventBook</span></h1>
          <p>Sign in to book the best events around you!</p>
        </div>
        
        <button className="btn-google-login" onClick={login}>
          <img 
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" 
            alt="Google Logo" 
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
