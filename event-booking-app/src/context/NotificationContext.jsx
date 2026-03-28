import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({});
  const prevNotifIds = useRef([]);

  const { user } = useAuth();
  const currentUserId = user ? (user._id || user.id) : 'guest';
  const userNotifications = notifications[currentUserId] || [];

  const fetchNotifications = async () => {
    if (!user || user.role === 'admin') return; 
    try {
      const res = await api.get('/api/notifications/my');
      const newNotifs = res.data.data || [];
      
      // Auto-trigger Epic Games styled popup for any physically new notification polled
      const newIds = newNotifs.map(n => n.id);
      const diffIds = newIds.filter(id => !prevNotifIds.current.includes(id));

      if (prevNotifIds.current.length > 0 && diffIds.length > 0) {
        diffIds.forEach(id => {
          const freshNotif = newNotifs.find(n => n.id === id);
          
          toast((t) => (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', margin: '-16px -24px', width: '100%', minWidth: '380px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 0 16px 20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff', lineHeight: 1.4, paddingRight: '12px' }}>
                    {freshNotif.message}
                  </h4>
                  <button onClick={() => toast.dismiss(t.id)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', padding: 0, marginTop: '-4px' }}>✕</button>
                </div>
                
                {freshNotif.event && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>
                      <span style={{ fontSize: '14px' }}>📅</span> {new Date(freshNotif.event.date).toLocaleDateString()} • {freshNotif.event.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>
                      <span style={{ fontSize: '14px' }}>📍</span> {freshNotif.event.venue}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ 
                width: '100px', backgroundColor: '#2563eb', flexShrink: 0, 
                backgroundImage: freshNotif.event?.image ? `url(${freshNotif.event.image})` : 'none', 
                backgroundSize: 'cover', backgroundPosition: 'center', 
                borderTopRightRadius: '8px', borderBottomRightRadius: '8px' 
              }}>
                {!freshNotif.event?.image && <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px'}}>🎟️</div>}
              </div>
            </div>
          ), { 
            duration: 4000,
            style: { minWidth: '400px', maxWidth: '500px' } 
          });
        });
      }
      
      prevNotifIds.current = newIds;

      setNotifications(prev => ({
        ...prev,
        [currentUserId]: newNotifs
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000); // Polling dynamically 
    return () => clearInterval(interval);
  }, [user]);

  // We maintain legacy frontend notifications for generic global alerts, but DB takes priority.
  const addNotification = (message, type, targetUserId = currentUserId) => {
    // Left empty since the server naturally fulfills this via real-time polling updates now.
  };

  const markRead = (id) => {
    // Optional patch endpoint, we'll just bypass and use readAll
  };

  const markAllRead = async () => {
    try {
      await api.patch('/api/notifications/read-all');
      fetchNotifications(); // instantly update state correctly to resolved DB values
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications: userNotifications,
      addNotification,
      markRead,
      markAllRead,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
