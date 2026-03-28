import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import './AdminEventForm.css';

const AdminEventForm = ({ initialData, isEditing, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concert',
    date: '',
    time: '',
    venue: '',
    totalSeats: '',
    availableSeats: '',
    price: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Format date for input: YYYY-MM-DD
      const date = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';
      setFormData({
        ...initialData,
        date
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        availableSeats: isEditing ? formData.availableSeats : formData.totalSeats // Set equal initially if new
      };

      if (isEditing) {
        await api.put(`/api/admin/events/${initialData._id}`, dataToSend);
        toast.success('Event Updated!');
      } else {
        await api.post('/api/admin/events', dataToSend);
        toast.success('Event Created!');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h3 className="event-form-title">{isEditing ? 'Edit Event' : 'Create New Event'}</h3>
      
      <div className="form-group form-group-full">
        <label>Event Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Coldplay Live 2025" />
      </div>

      <div className="form-group form-group-full">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Brief detail about the event..." />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="concert">Concert</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input name="image" value={formData.image} onChange={handleChange} required placeholder="https://picsum.photos/..." />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Time</label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Venue</label>
        <input name="venue" value={formData.venue} onChange={handleChange} required placeholder="e.g. Mumbai Stadium" />
      </div>

      <div className="form-group">
        <label>Price (₹)</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="499" />
      </div>

      <div className="form-group">
        <label>Total Seats</label>
        <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required placeholder="100" />
      </div>

      {isEditing && (
        <div className="form-group">
          <label>Available Seats (Manual Override)</label>
          <input 
            type="number" 
            name="availableSeats" 
            value={formData.availableSeats} 
            onChange={handleChange} 
            max={formData.totalSeats} 
            required 
          />
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-form-cancel" onClick={onClose} disabled={loading}>Cancel</button>
        <button type="submit" className="btn-form-save" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Save Event')}
        </button>
      </div>
    </form>
  );
};

export default AdminEventForm;
