import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/bookings/my');
      setBookings(res.data.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/api/bookings/${bookingId}/cancel`);
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? {...b, status: 'cancelled'} : b)
      );
      toast.success('Booking cancelled');
      addNotification('Booking cancelled successfully', 'booking_cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  if (loading) return <div className="container" style={{ padding: '80px 0' }}><Spinner /></div>;

  return (
    <div className="container bookings-container">
      {user && (
        <div className="profile-header-banner" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
          <img 
            src={user.avatar || 'https://i.pravatar.cc/150'} 
            referrerPolicy="no-referrer" 
            alt="Profile" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div>
            <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#1e293b' }}>{user.name}</h1>
            <p style={{ margin: 0, color: '#64748b' }}>User Profile</p>
          </div>
        </div>
      )}
      <h2 className="bookings-title" style={{ fontSize: '20px', margin: '0 0 20px 0' }}>Your Orders</h2>
      
      {error ? (
        <ErrorMessage message={error} onRetry={fetchBookings} />
      ) : bookings.length === 0 ? (
        <div className="empty-bookings">
          <div className="empty-icon">🎫</div>
          <h2>No bookings found</h2>
          <p>You haven't booked any events yet.</p>
        </div>
      ) : (
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="booking-event-name">{booking.event?.title || 'Unknown Event'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {booking.event?.venue}
                    </span>
                   </div>
                </td>
                <td>{booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}</td>
                <td>{booking.seats}</td>
                <td style={{ fontWeight: 600 }}>₹{booking.totalAmount}</td>
                <td>
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
