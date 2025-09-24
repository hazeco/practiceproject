import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Person, Dashboard, Home, Info, ContactMail, Login, PersonAdd, Logout } from '@mui/icons-material';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo Section */}
        <Link to="/" className="logo-section">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1976d2" />
                  <stop offset="100%" stopColor="#42a5f5" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" />
              <text x="20" y="27" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">M</text>
            </svg>
          </div>
          <span className="logo-text">MyWeb</span>
        </Link>

        {/* Navigation */}
        <nav className="navigation">
          <Link to="/" className="nav-link">
            <Home className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/about" className="nav-link">
            <Info className="nav-icon" />
            <span>About</span>
          </Link>
          <Link to="/contact" className="nav-link">
            <ContactMail className="nav-icon" />
            <span>Contact</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <Dashboard className="nav-icon" />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="nav-link">
                <Person className="nav-icon" />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <Logout className="nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <Login className="nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-link register-link">
                <PersonAdd className="nav-icon" />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;