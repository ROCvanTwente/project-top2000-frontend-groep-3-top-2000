import React, { useEffect, useState } from 'react';
import NavBar from '../components/navBar';
import { Sidebar } from '../components/sidebar';
import { Footer } from '../components/footer';
import '../styles/auth.css';
import '../styles/account.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { BASE_API_URL } from '../data/api-url';

export default function Account() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // edit states
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('userEmail');
    } catch (e) { }
    window.location.href = '/';
  };

  useEffect(() => {
    const loadProfile = async () => {
      setError('');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // fallback to localStorage email if present
        const e = typeof window !== 'undefined' && localStorage.getItem('userEmail');
        setEmail(e || '');
        return;
      }

      try {
        const apiUrl = `${BASE_API_URL}/api/account/profile`;
        console.log('Fetching profile from:', apiUrl);

        const res = await fetch(apiUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Profile response status:', res.status);

        if (res.status === 401) {
          // not authorized - redirect to login
          window.location.href = '/login';
          return;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Profile error:', res.status, errorText);
          throw new Error(`Failed to load profile: ${res.status}`);
        }

        const data = await res.json();
        setEmail(data.email || '');
        // keep local copy too
        try { localStorage.setItem('userEmail', data.email || ''); } catch (e) { }
      } catch (err) {
        console.error('Profile fetch error:', err);
        // on error fallback to localStorage email
        const e = typeof window !== 'undefined' && localStorage.getItem('userEmail');
        setEmail(e || '');
        // Only show error if we don't have a fallback email
        if (!e) {
          setError('Kon profiel niet laden: ' + (err.message || 'Netwerkfout'));
        }
      }
    };

    loadProfile();
  }, []);

  const shortName = email ? email.split('@')[0] : 'Gast';

  const updatePassword = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setError('');
    if (!newPassword) return setError('Vul nieuw wachtwoord in');
    if (newPassword !== confirmNewPassword) return setError('Nieuwe wachtwoorden komen niet overeen');
    const token = localStorage.getItem('accessToken');
    if (!token) return window.location.href = '/login';

    try {
      const payload = { currentPassword: currentPasswordForChange, newPassword };
      const apiUrl = `${BASE_API_URL}/api/account/password`;

      console.log('Updating password at:', apiUrl);

      const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Password update response status:', res.status);

      const text = await res.text();
      console.log('Password update response:', text);

      let body = null;
      try { body = JSON.parse(text); } catch (err) { /* not JSON */ }

      if (!res.ok) {
        const msg = (body && body.message) ? body.message : `Status ${res.status}: ${text}`;
        setError(msg);
        return;
      }

      setEditingPassword(false);
      setCurrentPasswordForChange('');
      setNewPassword('');
      setConfirmNewPassword('');
      alert('Wachtwoord gewijzigd');
    } catch (err) {
      console.error('updatePassword error', err);
      setError('Netwerkfout: ' + (err.message || 'Controleer de console voor details'));
    }
  };

  const onDeleteAccount = async () => {
    const password = prompt('Voer je wachtwoord in om je account te verwijderen:');
    if (!password) return;

    if (!confirm('Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return window.location.href = '/login';

    try {
      const res = await fetch(`${BASE_API_URL}/api/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Kon account niet verwijderen');
        return;
      }

      // Clear all local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('userEmail');

      alert('Account verwijderd');
      window.location.href = '/';
    } catch (err) {
      console.error('deleteAccount error', err);
      setError('Netwerkfout');
    }
  };

    return (
    <div className="account-page">
      <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="account-main container">
        <header className="account-header">
          <div className="avatar" aria-hidden>
            <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
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
          </div>

          <div className="info-row">
            <div className="label">Wachtwoord veranderen:</div>
            <div className="value">
              {editingPassword ? (
                <div className="edit-inline">
                  <input className="edit-input" type="password" placeholder="Huidig wachtwoord" value={currentPasswordForChange} onChange={e => setCurrentPasswordForChange(e.target.value)} />
                  <input className="edit-input" type="password" placeholder="Nieuw wachtwoord" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  <input className="edit-input" type="password" placeholder="Bevestig nieuw wachtwoord" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                  <button className="btn-save" onClick={updatePassword}>Opslaan</button>
                  <button className="btn-cancel" onClick={() => { setEditingPassword(false); setCurrentPasswordForChange(''); setNewPassword(''); setConfirmNewPassword(''); }}>Annuleer</button>
                </div>
              ) : (
                <>
                  *********
                  <button className="icon-btn" title="Wijzig wachtwoord" aria-label="Wijzig wachtwoord" onClick={() => setEditingPassword(true)}>
                    <FiEdit />
                  </button>
                </>
              )}
            </div>
          </div>
          {error && <div className="error">{error}</div>}

          <div className="advanced">
            <h3>Geavanceerde Opties</h3>
            <div className="danger-row">
              <button className="link-danger" aria-label="Verwijder account" onClick={onDeleteAccount}>
                <FiTrash2 style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Account verwijderen
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