import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AvatarProvider } from './context/AvatarContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AvatarProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AvatarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
