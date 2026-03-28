import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllRead();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button className="notif-bell" onClick={toggleDropdown}>
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications ({unreadCount})</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet</div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => markRead(notif.id)}
                >
                  <div className="notif-icon" style={{ borderRadius: '6px', overflow: 'hidden', padding: 0, width: '40px', height: '40px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {notif.event?.image ? (
                      <img src={notif.event.image} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '18px' }}>
                        {notif.type === 'booking_confirmed' ? '🎟️' : notif.type === 'booking_cancelled' ? '❌' : '⚙️'}
                      </span>
                    )}
                  </div>
                  <div className="notif-content" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p className="notif-message" style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{notif.message}</p>
                    
                    {notif.event && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>📅 {new Date(notif.event.date).toLocaleDateString()} • {notif.event.time}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>📍 {notif.event.venue}</span>
                      </div>
                    )}
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

export default NotificationBell;
