import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import './EventCard.css';

const EventCard = ({ event, onBookClick }) => {
  const isSoldOut = event.availableSeats === 0;
  const formattedDate = format(new Date(event.date), 'MMMM d, yyyy');

  return (
    <div className="event-card">
      <div className="card-image-container">
        <Link to={`/events/${event._id}`}>
          <img src={event.image} alt={event.title} className="card-image" />
        </Link>
        <span className={`category-badge category-${event.category}`}>
          {event.category}
        </span>
        {isSoldOut && <span className="sold-out-badge">Sold Out</span>}
      </div>
      <div className="card-body">
        <Link to={`/events/${event._id}`} className="event-title">
          {event.title}
        </Link>
        <div className="event-meta">
          <span>📅 {formattedDate} • {event.time}</span>
          <span>📍 {event.venue}</span>
        </div>
        <div className="price-tag">₹{event.price}</div>
        <div className="card-footer">
          <span className="seats-info">
            {isSoldOut ? 'No seats left' : `${event.availableSeats} seats available`}
          </span>
          <button
            className="btn-book"
            onClick={(e) => {
              e.preventDefault();
              onBookClick(event);
            }}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold Out' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
