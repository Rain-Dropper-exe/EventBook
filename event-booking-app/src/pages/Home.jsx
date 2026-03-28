import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, startOfToday, addYears } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CalendarPicker from '../components/CalendarPicker';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import './Home.css';

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const today = startOfToday();
  const todayStr = format(today, 'yyyy-MM-dd');
  const rollingYearEnd = format(addYears(today, 1), 'yyyy-MM-dd');

  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState(todayStr);
  const [dateTo, setDateTo] = useState(rollingYearEnd);
  const [calKey, setCalKey] = useState(0); 
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (location.state) {
      let stateChanged = false;
      if (location.state.viewMode && location.state.viewMode !== viewMode) {
        setViewMode(location.state.viewMode);
        stateChanged = true;
      }
      if (location.state.filter && location.state.filter !== filter) {
        setFilter(location.state.filter);
        stateChanged = true;
      }
      if (location.state.scrollToEvents) {
        setTimeout(() => {
          document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        stateChanged = true;
      }
      
      if (stateChanged) {
        // Clear state so reload doesn't re-trigger it
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, navigate, location.pathname, viewMode, filter]);
  
  const handleBookClick = (event) => {
    if (event.availableSeats === 0) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedEvent(event);
  };
  
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // For List View (no pagination)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;

  const clearFilters = () => {
    setFilter('All');
    setSearchQuery('');
    setDateFrom(todayStr);
    setDateTo(rollingYearEnd);
    setCalKey(prev => prev + 1);
    setCurrentPage(1);
  };

  const handleRangeChange = (from, to) => {
    setDateFrom(from);
    setDateTo(to);
    setCurrentPage(1);
  };

  // Fetch paginated events for Grid View
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { 
        page: currentPage, 
        limit: eventsPerPage,
        sort: 'date'
      };
      if (filter !== 'All') params.category = filter;
      
      const res = await api.get('/api/events', { params });
      setEvents(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all events for List View and Hero section
  const fetchAllEvents = async () => {
    try {
      const res = await api.get('/api/events', { params: { limit: 100, sort: 'date' } });
      setAllEvents(res.data.data);
    } catch (err) {
      console.error('Failed to fetch all events', err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filter, viewMode]);

  // Client-side filtering for List View (allows smooth date-range and search feedback)
  const filteredListEvents = allEvents.filter(event => {
    const matchCategory = filter === 'All' || event.category.toLowerCase() === filter.toLowerCase();
    const matchDateFrom = !dateFrom || new Date(event.date) >= new Date(dateFrom);
    const matchDateTo = !dateTo || new Date(event.date) <= new Date(dateTo);
    const matchSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchDateFrom && matchDateTo && matchSearch;
  });

  const groupedEvents = filteredListEvents.reduce((acc, event) => {
    const dateKey = format(new Date(event.date), 'MMMM d, yyyy');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  const onPageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Carousel & Countdown
  const heroEvents = allEvents.length > 0 ? allEvents.slice(0, 5) : [];
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (heroEvents.length === 0) return;
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroEvents.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [heroEvents.length]);

  useEffect(() => {
    if (allEvents.length === 0) return;
    const now = new Date();
    const sortedFutureEvents = [...allEvents]
      .map(e => ({ ...e, dateTime: new Date(`${e.date.split('T')[0]} ${e.time}`) }))
      .filter(e => e.dateTime > now)
      .sort((a, b) => a.dateTime - b.dateTime);

    if (sortedFutureEvents.length === 0) return;
    const targetDate = sortedFutureEvents[0].dateTime;

    const timer = setInterval(() => {
      const currentTime = new Date();
      const difference = targetDate - currentTime;
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [allEvents]);

  const scrollToEvents = () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      {heroEvents.length > 0 && (
        <section className="hero">
          {heroEvents.map((event, index) => (
            <div
              key={event._id}
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${event.image})` }}
            />
          ))}
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="hero-eyebrow">UPCOMING EVENTS 2026</p>
            <h1 className="hero-title">{heroEvents[activeSlide].title}</h1>
            <div className="hero-event-meta">
              <span>📅 {format(new Date(heroEvents[activeSlide].date), 'MMM d, yyyy')}</span>
              <span className="meta-dot">·</span>
              <span>🕐 {heroEvents[activeSlide].time}</span>
              <span className="meta-dot">·</span>
              <span>📍 {heroEvents[activeSlide].venue}</span>
            </div>
            <div className="hero-price">₹{heroEvents[activeSlide].price}</div>
            <div className="hero-countdown">
              {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, idx) => (
                <React.Fragment key={label}>
                  <div className="countdown-block">
                    <span className="countdown-number">
                      {String(timeLeft[label.toLowerCase()]).padStart(2, '0')}
                    </span>
                    <span className="countdown-label">{label}</span>
                  </div>
                  {idx < 3 && <div className="countdown-divider" />}
                </React.Fragment>
              ))}
            </div>
            <div className="hero-buttons">
              <button 
                className="btn-book-hero" 
                onClick={() => handleBookClick(heroEvents[activeSlide])}
                disabled={heroEvents[activeSlide].availableSeats === 0}
              >
                {heroEvents[activeSlide].availableSeats === 0 
                  ? 'Sold Out' 
                  : `Book Now — ₹${heroEvents[activeSlide].price}`}
              </button>
            </div>
            <div className="hero-dots">
              {heroEvents.map((_, i) => (
                <button key={i} className={`hero-dot ${i === activeSlide ? 'active' : ''}`} onClick={() => setActiveSlide(i)} />
              ))}
            </div>
          </div>
          <button className="hero-arrow hero-arrow-left" onClick={() => setActiveSlide(prev => (prev - 1 + heroEvents.length) % heroEvents.length)}> &#8592; </button>
          <button className="hero-arrow hero-arrow-right" onClick={() => setActiveSlide(prev => (prev + 1) % heroEvents.length)}> &#8594; </button>
          <div className="hero-scroll-hint" onClick={scrollToEvents}>
            <span>Scroll to explore</span>
            <span className="scroll-arrow">↓</span>
          </div>
        </section>
      )}

      <div className="container" id="events-section">
        <div className="view-header">
          {viewMode === 'list' ? (
            <CalendarPicker key={calKey} onRangeChange={handleRangeChange} initialDateFrom={dateFrom} />
          ) : (
            <div className="grid-placeholder" style={{visibility: 'hidden'}}><CalendarPicker key={calKey}/></div>
          )}
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => { setViewMode('grid'); setFilter('All'); setCurrentPage(1); }}> Grid View </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}> List View </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid-view-container">
            {loading ? <Spinner /> : error ? <ErrorMessage message={error} onRetry={fetchEvents} /> : events.length === 0 ? (
              <div className="empty-state">No events found matching your criteria.</div>
            ) : (
              <>
                <div className="event-grid">
                  {events.map(event => <EventCard key={event._id} event={event} onBookClick={handleBookClick} />)}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
              </>
            )}
          </div>
        ) : (
          <div className="list-view-layout">
            <aside className="calendar-sidebar">
              <h3>Filters</h3>
              <div className="sidebar-filter">
                <label>Search Events</label>
                <input type="text" placeholder="Search by name, venue..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="sidebar-filter">
                <label>Category</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="concert">Concert</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
              <button className="clear-filters-btn" onClick={clearFilters}> Clear Filters </button>
            </aside>
            <main className="list-view-content">
              {Object.keys(groupedEvents).length === 0 ? (
                <div className="empty-state">No events found for the selected dates.</div>
              ) : (
                (() => {
                  let lastMonth = '';
                  return Object.entries(groupedEvents).map(([date, events]) => {
                    const currentMonth = format(new Date(events[0].date), 'MMMM yyyy');
                    const showMonth = currentMonth !== lastMonth;
                    lastMonth = currentMonth;
                    return (
                      <React.Fragment key={date}>
                        {showMonth && <div className="month-divider">{currentMonth}</div>}
                        <div className="date-group">
                          <div className="date-label">
                            <span className="day-name">{format(new Date(events[0].date), 'EEE')}</span>
                            <span className="day-number">{format(new Date(events[0].date), 'd')}</span>
                          </div>
                          <div className="date-events">
                            {events.map(event => (
                              <div key={event._id} className="list-event-card" onClick={() => navigate(`/events/${event._id}`)}>
                                <div className="list-event-info">
                                  <span className="list-event-time">🕐 {event.time}</span>
                                  <h3 className="list-event-title">{event.title}</h3>
                                  <p className="list-event-venue">📍 {event.venue}</p>
                                  <p className="list-event-desc">{event.description?.slice(0, 160)}...</p>
                                  <div className="list-event-footer">
                                    <span className="list-event-price">₹{event.price}</span>
                                    <span className={`category-badge cat-${event.category.toLowerCase()}`}>{event.category}</span>
                                    <button 
                                      className="book-btn-small" 
                                      onClick={(e) => { e.stopPropagation(); handleBookClick(event); }}
                                      disabled={event.availableSeats === 0}
                                      style={event.availableSeats === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    >
                                      {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                                    </button>
                                  </div>
                                </div>
                                <img src={event.image} alt={event.title} className="list-event-image" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()
              )}
            </main>
          </div>
        )}
      </div>
      {selectedEvent && <BookingModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default Home;
