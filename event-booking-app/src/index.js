import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <App />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#121212',
                color: '#ffffff',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                letterSpacing: '0.3px',
              },
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
