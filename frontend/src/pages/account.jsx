import React from 'react';
import '../styles/auth.css';
import logo from '../assets/top-2000-logo.png';

export default function Account() {
  const email = (typeof window !== 'undefined') ? localStorage.getItem('userEmail') : null;

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('userEmail');
    } catch (e) {}
    window.location.href = '/';
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img src={logo} alt="logo" style={{ height: 140 }} />
      </div>

      <div className="auth-title">Account</div>

      <div style={{ textAlign: 'center' }}>
        <p>Ingelogd als: {email || 'Onbekend'}</p>
        <button className="auth-button" onClick={handleLogout}>Uitloggen</button>
      </div>
    </div>
  );
}
