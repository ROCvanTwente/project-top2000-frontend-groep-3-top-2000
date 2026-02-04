/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import NavBar from '../components/navBar';
import { Sidebar } from '../components/sidebar';
import { Footer } from '../components/footer';
import '../styles/auth.css';
import logo from '../assets/top-2000-logo.png';
import { BASE_API_URL } from '../data/api-url';
import { AnimatedBackground } from '../components/AnimatedBackground';

export default function Login() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Base URL for the API (optional). If not set, requests are relative.
    // Read Vite env safely; fallback to process.env. If still not set, default to the backend you mentioned.
    // Prefer using relative `/api` so the Vite proxy (vite.config.js) can forward calls to the backend.
    // If you need to target a remote backend directly, set VITE_API_URL in `.env`.

    const apiPrefix = BASE_API_URL;

    console.log('Login component render, using apiPrefix=', apiPrefix || '/api (proxy)');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const base = apiPrefix ? apiPrefix.replace(/\/$/, '') : '';
            const url = (base || '') + '/api/auth/login';
            console.log('POST', url, { email });

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const raw = await res.text();
            console.log('Login response raw:', res.status, raw);

            if (!res.ok) {
                let body = null;
                try { body = JSON.parse(raw); } catch (e) { body = e; }
                const serverMsg = body?.message || body?.error || raw || `Login failed (${res.status})`;
                setError(serverMsg);
                setLoading(false);
                return;
            }

            let data = {};
            try { data = JSON.parse(raw); } catch (e) { data = { e }; }

            if (data.token) localStorage.setItem('accessToken', data.token);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            if (data.expiresAt) {
                localStorage.setItem('tokenExpiresAt', new Date(data.expiresAt).toISOString());
            }

            try { localStorage.setItem('userEmail', email); } catch (e) { /* ignore */ }

            window.location.href = '/';
        } catch (err) {
            console.error('Login error', err);
            setError(err?.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedBackground>
            <div className="auth-page">
                <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="auth-main">
                <div className="auth-container">
                    <div className="auth-logo">
                        <img src={logo} alt="logo" style={{ height: 140 }} />
                    </div>

                    <div className="auth-tabs">
                        <div style={{ backgroundColor: "#363b4b" }} className="auth-tab active btn btn-primary">Inloggen</div>
                        <a href="/register" className="auth-tab btn btn-secondary">Registreer</a>
                    </div>

                    {error && (
                        <div className="auth-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            className="form-control auth-input mb-3"
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            className="form-control auth-input mb-3"
                            type="password"
                            placeholder="Wachtwoord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button style={{ backgroundColor: "#363b4b" }} className={"btn btn-primary auth-button"} type="submit" disabled={loading}>
                        {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
            </div>
        </AnimatedBackground>
    );
}
