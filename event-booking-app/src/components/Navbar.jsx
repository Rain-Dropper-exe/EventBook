import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookEvent = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="logo">EventBook</Link>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-section">
              <NotificationBell />
              <Link to="/" className="btn-cta-hero" style={{ textDecoration: 'none', background: '#2563eb' }}>
                Home
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-cta-hero" style={{ textDecoration: 'none', background: '#2563eb' }}>
                  Manage Events
                </Link>
              )}
              {user.role !== 'admin' && (
                <>
                  <button className="btn-cta-hero" onClick={handleBookEvent} style={{ background: '#2563eb' }}>
                    Book Event
                  </button>
                  <Link to="/orders" className="btn-cta-hero" style={{ textDecoration: 'none', background: '#2563eb' }}>
                    Orders
                  </Link>
                </>
              )}
              <div className="user-detail-group">
                <div className="avatar-link" title="User Profile">
                  <img 
                    src={user.avatar || 'https://i.pravatar.cc/150'} 
                    alt="User avatar" 
                    className="avatar" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              </div>
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-signin">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
