import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const closeMenu = () => setMenuOpen(false);

  // Link wrapper to close menu on click
  const MobileLink = ({ to, className, style, children, onClick }) => (
    <Link 
      to={to} 
      className={className} 
      style={style} 
      onClick={() => {
        closeMenu();
        if(onClick) onClick();
      }}
    >
      {children}
    </Link>
  );

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="logo" onClick={closeMenu}>EventBook</Link>
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>

        <div className={`nav-right ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <div className="user-section">
              <NotificationBell />
              <MobileLink to="/" className="btn-cta-hero" style={{ textDecoration: 'none', background: '#2563eb' }}>
                Home
              </MobileLink>
              {user.role === 'admin' && (
                <MobileLink to="/admin" className="btn-cta-hero" style={{ textDecoration: 'none', background: '#2563eb' }}>
                  Manage Events
                </MobileLink>
              )}
              {user.role !== 'admin' && (
                <>
                  <button className="btn-cta-hero" onClick={handleBookEvent} style={{ background: '#2563eb' }}>
                    Book Event
                  </button>
                  <MobileLink to="/orders" className="btn-cta-hero" style={{ textDecoration: 'none', background: '#2563eb' }}>
                    Orders
                  </MobileLink>
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
              <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">Logout</button>
            </div>
          ) : (
            <button onClick={() => { navigate('/login'); closeMenu(); }} className="btn-signin">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
