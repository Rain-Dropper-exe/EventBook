import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import './BookingModal.css';

// Use a placeholder or environment key. Even if invalid, the UI will load, and our mock submission bypasses it.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const stripeOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e293b',
      '::placeholder': { color: '#94a3b8' }
    }
  }
};

const CheckoutForm = ({ event, seats, totalAmount, onSuccess, onCancel, addNotification }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);
  
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isExpiryComplete, setIsExpiryComplete] = useState(false);
  const [isCvcComplete, setIsCvcComplete] = useState(false);

  const handleCardNumberChange = (event) => {
    setIsCardComplete(event.complete);
    if (event.complete && elements) {
      const expiryElement = elements.getElement(CardExpiryElement);
      if (expiryElement) expiryElement.focus();
    }
  };

  const handleExpiryChange = (event) => {
    setIsExpiryComplete(event.complete);
    if (event.complete && elements) {
      const cvcElement = elements.getElement(CardCvcElement);
      if (cvcElement) cvcElement.focus();
    }
  };
  
  const handleCvcChange = (event) => {
    setIsCvcComplete(event.complete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    if (!isCardComplete || !isExpiryComplete || !isCvcComplete) {
      setCardError('Please fill out all payment details before proceeding.');
      return;
    }
    
    setProcessing(true);
    setCardError(null);

    try {
      // 3. Confirm booking directly in backend
      await api.post('/api/bookings/confirm', {
        paymentIntentId: 'mock_intent_demo_mode',
        eventId: event._id,
        seats: parseInt(seats)
      });

      onSuccess();
      toast.success('Payment done, you will be notified as soon as possible!');

    } catch (err) {
      setCardError(err.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="stripe-input-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: '2', minWidth: '150px' }}>
          <CardNumberElement options={{ ...stripeOptions, showIcon: true }} onChange={handleCardNumberChange} />
        </div>
        <div style={{ color: '#cbd5e1', fontWeight: 600 }}>|</div>
        <div style={{ flex: '1', minWidth: '70px', paddingLeft: '8px' }}>
          <CardExpiryElement options={stripeOptions} onChange={handleExpiryChange} />
        </div>
        <div style={{ color: '#cbd5e1', fontWeight: 600 }}>|</div>
        <div style={{ flex: '0.6', minWidth: '40px', paddingLeft: '8px' }}>
          <CardCvcElement options={stripeOptions} onChange={handleCvcChange} />
        </div>
      </div>
      {cardError && <p className="card-error">{cardError}</p>}
      <div className="modal-actions" style={{ marginTop: '20px' }}>
        <button type="button" onClick={onCancel} className="btn-cancel" disabled={processing}>Cancel</button>
        <button
          type="submit"
          disabled={processing || !stripe || !isCardComplete || !isExpiryComplete || !isCvcComplete}
          className="btn-confirm"
        >
          {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
        </button>
      </div>
    </form>
  );
};

const BookingModal = ({ event, onClose }) => {
  const { addNotification } = useNotifications();
  const [seats, setSeats] = useState(1);
  const totalAmount = seats * event.price;

  const handleSeatChange = (e) => {
    const value = parseInt(e.target.value);
    const maxSeats = Math.min(5, event.availableSeats);
    if (value >= 1 && value <= maxSeats) setSeats(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{event.title}</h2>
        <div className="modal-info">
          <span>📅 {new Date(event.date).toLocaleDateString()} • {event.time}</span>
          <span>📍 {event.venue}</span>
        </div>
        
        <div className="modal-price-row">
          <div className="seat-selector">
            <label htmlFor="seatsCount">Number of Seats:</label>
            <input
              type="number"
              id="seatsCount"
              className="seat-input"
              value={seats}
              onChange={handleSeatChange}
              min="1"
              max={Math.min(5, event.availableSeats)}
            />
          </div>
          <div className="total-display">
            <span className="total-label">Subtotal</span>
            <span className="total-amount">₹{totalAmount}</span>
          </div>
        </div>

        <div className="stripe-container" style={{ marginTop: '20px' }}>
          <label className="card-label">Payment Details</label>
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              event={event} 
              seats={seats} 
              totalAmount={totalAmount} 
              onSuccess={onClose} 
              onCancel={onClose}
              addNotification={addNotification}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
