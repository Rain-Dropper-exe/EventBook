import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminEventForm from '../components/AdminEventForm';
import { useNotifications } from '../context/NotificationContext';
import CalendarPicker from '../components/CalendarPicker';
import AdminCalendarView from '../components/AdminCalendarView';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('calendar');
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [adminDateFrom, setAdminDateFrom] = useState('');
  const [adminDateTo, setAdminDateTo] = useState('');
  const [adminCategory, setAdminCategory] = useState('');
  const [adminCalKey, setAdminCalKey] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchAdminEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/events');
      setEvents(res.data.data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminBookings = async () => {
    try {
      const res = await api.get('/api/admin/bookings');
      setBookings(res.data.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    fetchAdminEvents();
    fetchAdminBookings();

    // Auto-poll bookings so the dashboard updates live for the presentation without manual refreshes!
    const interval = setInterval(() => {
      fetchAdminBookings();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const clearAdminFilters = () => {
    setAdminDateFrom('');
    setAdminDateTo('');
    setAdminCategory('');
    setAdminCalKey(prev => prev + 1);
  };

  const filteredEventsAdmin = events.filter(event => {
    const matchCategory = !adminCategory || event.category === adminCategory;
    const matchDateFrom = !adminDateFrom || new Date(event.date) >= new Date(adminDateFrom);
    const matchDateTo = !adminDateTo || new Date(event.date) <= new Date(adminDateTo);
    return matchCategory && matchDateFrom && matchDateTo;
  });

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleApprove = async (bookingId) => {
    try {
      const targetBooking = bookings.find(b => b._id === bookingId);
      await api.patch(`/api/admin/bookings/${bookingId}/approve`);
      toast.success('Booking approved!');
      fetchAdminBookings();
      
      if (targetBooking?.user?._id) {
        addNotification(`Your booking for ${targetBooking.event?.title} was approved!`, 'success', targetBooking.user._id);
      }
    } catch (err) {
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const targetBooking = bookings.find(b => b._id === bookingId);
      await api.patch(`/api/admin/bookings/${bookingId}/reject`);
      toast.error('Booking rejected');
      fetchAdminBookings();
      
      if (targetBooking?.user?._id) {
        addNotification(`Your booking for ${targetBooking.event?.title} was rejected.`, 'error', targetBooking.user._id);
      }
    } catch (err) {
      toast.error('Failed to reject booking');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/api/admin/events/${id}`);
      toast.error('🗑️ Event Deleted');
      fetchAdminEvents();
      addNotification(`Event Deleted: ${id}`, 'admin_action');
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      // Assuming our backend uses DELETE to toggle or has a specific PATCH
      // Based on the user's snippet, it was handleDelete but described as Toggle 
      // I'll stick to a toggle logic if available, but for now I'll follow the user's snippet
      await api.delete(`/api/admin/events/${id}`); 
      toast.success('Event status updated');
      fetchAdminEvents();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const onFormSubmit = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchAdminEvents();
  };

  return (
    <div className="container admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>

      <div className="tab-nav">
        {['calendar', 'events', 'bookings', 'approvals'].map(tab => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'approvals' && bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="badge">{bookings.filter(b => b.status === 'pending').length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAdminEvents} />
      ) : activeTab === 'calendar' ? (
        <div className="tab-content">
          {!showForm && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn-add-event" onClick={() => setShowForm(true)}>+ Add New Event</button>
            </div>
          )}
          {showForm ? (
            <div className="form-toggle-section">
              <AdminEventForm 
                initialData={editingEvent} 
                isEditing={!!editingEvent}
                onSuccess={onFormSubmit}
                onClose={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }} 
              />
            </div>
          ) : (
            <AdminCalendarView 
              events={events} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </div>
      ) : activeTab === 'events' ? (
        <div className="tab-content">
          {!showForm && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn-add-event" onClick={() => setShowForm(true)}>+ Add New Event</button>
            </div>
          )}
          <div className="admin-date-filter">
            <div className="filter-group">
              <CalendarPicker 
                key={adminCalKey} 
                onRangeChange={(from, to) => {
                  setAdminDateFrom(from);
                  setAdminDateTo(to);
                }}
                initialDateFrom={adminDateFrom}
              />
              <select value={adminCategory} onChange={(e) => setAdminCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="concert">Concert</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
              </select>
              <button className="btn-clear-admin" onClick={clearAdminFilters}>Clear</button>
            </div>
          </div>

          {showForm && !editingEvent && (
            <div className="form-toggle-section">
              <AdminEventForm 
                initialData={null} 
                isEditing={false}
                onSuccess={onFormSubmit}
                onClose={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }} 
              />
            </div>
          )}

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Seats Left</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEventsAdmin.map(event => (
                  <React.Fragment key={event._id}>
                    <tr>
                      <td><span style={{ fontWeight: 600 }}>{event.title}</span></td>
                      <td style={{ textTransform: 'capitalize' }}>{event.category}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>₹{event.price}</td>
                      <td>{event.availableSeats} / {event.totalSeats}</td>
                      <td>
                        <span className={`status-pill ${event.isActive ? 'active' : 'inactive'}`}>
                          {event.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit-admin" onClick={() => handleEdit(event)}>Edit</button>
                          <button className="btn-delete-admin" onClick={() => handleDelete(event._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                    {showForm && editingEvent && editingEvent._id === event._id && (
                      <tr className="admin-edit-row">
                        <td colSpan="7" style={{ padding: '0', backgroundColor: 'var(--bg-card)' }}>
                          <div className="form-toggle-section" style={{ margin: '15px' }}>
                            <AdminEventForm 
                              initialData={editingEvent} 
                              isEditing={true}
                              onSuccess={onFormSubmit}
                              onClose={() => {
                                setShowForm(false);
                                setEditingEvent(null);
                              }} 
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'bookings' ? (
        <div className="tab-content">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Event</th>
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
                      <div className="user-info-admin">
                        <img src={booking.user?.avatar || "https://i.pravatar.cc/24"} alt="user" className="user-avatar-admin" />
                        <span>{booking.user?.name || "User"}</span>
                      </div>
                    </td>
                    <td>{booking.event?.title}</td>
                    <td>{booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{booking.seats}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>
                      <span className={`booking-status status-${booking.status}`} style={{ fontSize: '0.7rem' }}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="tab-content">
          <div className="approvals-list">
            {bookings.filter(b => b.status === 'pending').length === 0 ? (
              <div className="notif-empty">No pending approvals</div>
            ) : (
              bookings.filter(b => b.status === 'pending').map(booking => (
                <div key={booking._id} className="approval-card">
                  <div className="approval-info">
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <img src={booking.user?.avatar || "https://i.pravatar.cc/32"} className="user-avatar-admin" alt="" />
                    <strong>{booking.user?.name || "User"}</strong>
                   </div>
                    <span> wants to book {booking.seats} seat(s) for </span>
                    <strong>{booking.event?.title}</strong>
                    <span> on {booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'} · ₹{booking.totalAmount}</span>
                  </div>
                  <div className="approval-actions">
                    <button className="approve-btn" onClick={() => handleApprove(booking._id)}>✓ Approve</button>
                    <button className="reject-btn" onClick={() => handleReject(booking._id)}>✗ Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
