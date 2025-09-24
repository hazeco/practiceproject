import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import MessageList from './pages/MessageList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
