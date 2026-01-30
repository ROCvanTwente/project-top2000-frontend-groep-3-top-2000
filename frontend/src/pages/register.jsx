import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import { Sidebar } from '../components/sidebar';
import { Footer } from '../components/footer';
import '../styles/auth.css';
import logo from '../assets/top-2000-logo.png';
import { BASE_API_URL } from '../data/api-url';

export default function Register() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);

        try {
            const url = BASE_API_URL + '/api/auth/register';
            console.log('POST', url, { email });

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const raw = await res.text();
            console.log('Register response raw:', res.status, raw);

            if (!res.ok) {
                let body = null;
                try { body = JSON.parse(raw); } catch (e) { 
                    console.log('Failed to parse error response JSON', e);
                    body = null; }
                const serverMsg = body?.message || body?.error || raw || `Register failed (${res.status})`;
                setError(serverMsg);
                setLoading(false);
                return;
            }

            let data = {};
            try { data = JSON.parse(raw); } catch (e) {
                console.log('Failed to parse success response JSON', e);
                data = {}; }

            // Save tokens and email
            if (data.token) localStorage.setItem('accessToken', data.token);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            if (data.expiresAt) localStorage.setItem('tokenExpiresAt', new Date(data.expiresAt).toISOString());
            try { localStorage.setItem('userEmail', email); } catch (e) {console.log('Failed to save userEmail', e); }

            // Redirect to account page
            navigate('/account');
        } catch (err) {
            console.error('Register error', err);
            setError(err?.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="auth-main">
                <div className="auth-container">
                    <div className="auth-logo">
                        <img src={logo} alt="logo" style={{ height: 140 }} />
                    </div>

                    <div className="auth-tabs">
                        <a href="/login" className="auth-tab">Log in</a>
                        <div className="auth-tab active">Registreer</div>
                    </div>

                    {error && (
                        <div className="auth-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Wachtwoord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Bevestig wachtwoord"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />

                        <button className="auth-button" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Registreer'}
                        </button>
                    </form>

                </div>
            </main>
            <Footer />
        </div>
    );
}
