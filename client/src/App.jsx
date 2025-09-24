import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import './App.css';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderVisibilityWrapper />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

function HeaderVisibilityWrapper() {
  const location = useLocation();
  const hideHeader = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!hideHeader && <Header />}
      <div className="container mx-auto mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
