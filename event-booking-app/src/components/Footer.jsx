import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookEvent = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col about">
            <Link to="/" className="footer-logo">EventBook</Link>
            <p className="footer-desc">
              Experience the best events in India. From soulful concerts and high-energy workshops to world-class tech conferences, we bring you the ultimate booking platform for unforgettable experiences.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              {user ? (
                <>
                  <li><Link to="/">Home</Link></li>
                  {user.role === 'admin' ? (
                    <li><Link to="/admin">Manage Events</Link></li>
                  ) : (
                    <>
                      <li><a href="/" onClick={handleBookEvent}>Book Event</a></li>
                      <li><Link to="/orders">Orders</Link></li>
                    </>
                  )}
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/login">Login</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/" state={{ viewMode: 'list', filter: 'concert', scrollToEvents: true }}>Concerts</Link></li>
              <li><Link to="/" state={{ viewMode: 'list', filter: 'conference', scrollToEvents: true }}>Conferences</Link></li>
              <li><Link to="/" state={{ viewMode: 'list', filter: 'workshop', scrollToEvents: true }}>Workshops</Link></li>
              <li><Link to="/" state={{ viewMode: 'list', filter: 'festival', scrollToEvents: true }}>Festivals</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact-item">
              <span className="footer-icon">📍</span>
              <p>123 Event Street, Worli, Mumbai, 400018</p>
            </div>
            <div className="footer-contact-item">
              <span className="footer-icon">📧</span>
              <p>support@eventbook.in</p>
            </div>
            <div className="footer-contact-item">
              <span className="footer-icon">📞</span>
              <p>+91 9876543210</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 EventBook. Created for unforgettable experiences.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link">Instagram</a>
            <a href="#" className="footer-social-link">Twitter</a>
            <a href="#" className="footer-social-link">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
