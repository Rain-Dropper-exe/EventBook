import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import './EventDetail.css';

const EventDetail = () => {
  const { user, login } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seats, setSeats] = useState(1);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      setError('Event not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '80px 0' }}><Spinner /></div>;
  if (error || !event) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <ErrorMessage message={error || 'Event not found'} onRetry={fetchEvent} />
        <button className="back-btn" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Back to Home
        </button>
      </div>
    );
  }
  
  const handleBookClick = () => {
    if (event.availableSeats === 0) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="container detail-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Events
      </button>

      <div className="detail-layout">
        <div className="detail-left">
          <img src={event.image} alt={event.title} className="detail-image" />
          <div className="detail-header">
            <h1 className="detail-title">{event.title}</h1>
            <span className={`detail-category category-${event.category}`}>
              {event.category}
            </span>
            <p className="detail-description">{event.description}</p>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time</span>
              <span className="info-value">{event.time}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Venue</span>
              <span className="info-value">{event.venue}</span>
            </div>
          </div>
        </div>

        <div className="detail-right">
          <div className="sticky-booking-card">
            <div className="detail-price-main">₹{event.price}</div>
            <div className="detail-price-label">Per person</div>
            
            {!isSoldOut && (
              <span className="available-seats-detail">
                {event.availableSeats} seats remaining
              </span>
            )}
            
            <div className="booking-form-inline">
              <div className="seat-qty">
                <label>Select Seats</label>
                <input
                  type="number"
                  min="1"
                  max={Math.min(5, event.availableSeats)}
                  value={seats}
                  onChange={(e) => setSeats(Math.min(Math.min(5, event.availableSeats), Math.max(1, parseInt(e.target.value) || 1)))}
                  disabled={isSoldOut}
                />
              </div>

              <div className="total-summary">
                <span className="info-label">Total Amount</span>
                <span className="detail-price-main" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
                  ₹{seats * event.price}
                </span>
              </div>

              <button
                className="btn-book-full"
                onClick={handleBookClick}
                disabled={isSoldOut}
              >
                {isSoldOut ? 'Sold Out' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal
          event={{ ...event }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventDetail;
