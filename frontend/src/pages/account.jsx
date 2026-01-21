import React, { useState } from 'react';
import NavBar from '../components/navBar';
import { Footer } from '../components/footer';
import '../styles/auth.css';
import '../styles/account.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Account() {
  const [email, setEmail] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : ''));
  const [error, setError] = useState('');

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('userEmail');
    } catch (e) { }
    window.location.href = '/';
  };

  const shortName = email ? email.split('@')[0] : 'Gast';

  const onEditEmail = () => {
    alert('NIEEEEKK HELP Edit email - backend integration not implemented.');
  };

  const onEditPassword = () => {
    alert('NIEEEEKK HELP Edit password - backend integration not implemented.');
  };

  const onDeleteAccount = () => {
      alert('NIEEEEKK HELP Remove account - backend integration not implemented.');
  };

    return (
        <div className="account-page">
            <NavBar />

            <main className="account-main container">
                <header className="account-header">
                    <div className="avatar" aria-hidden>
                        <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path> {/*avatar*/}
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div className="welcome">Welkom {shortName} <span className="muted">({email})</span></div>
                </header>

                <section className="account-card">
                    <h2>Account informatie</h2>

                    <div className="info-row">
                        <div className="label">E-mail:</div>
                        <div className="value">{email || 'Onbekend'}</div>
                        <button className="icon-btn" title="Bewerk e-mail" aria-label="Bewerk e-mail" onClick={onEditEmail}>
                            <FiEdit />
                        </button>
                    </div>

                    <div className="info-row">
                        <div className="label">Wachtwoord:</div>
                        <div className="value">*********</div>
                        <button className="icon-btn" title="Wijzig wachtwoord" aria-label="Wijzig wachtwoord" onClick={onEditPassword}>
                            <FiEdit />
                        </button>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <div className="advanced">
                        <h3>Geavanceerde Opties</h3>
                        <div className="danger-row">
                            <button className="link-danger" aria-label="Delete account" onClick={onDeleteAccount}>
                                <FiTrash2 style={{ verticalAlign: 'middle', marginRight: 6 }} />
                                Delete account
                            </button>
                        </div>
                    </div>

                    <div className="actions">
                        <button className="btn-logout" onClick={handleLogout}>Uitloggen</button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}