import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import { Sidebar } from '../components/sidebar';
import { Footer } from '../components/footer';
import { FiSettings, FiUser, FiMusic, FiX, FiSave } from 'react-icons/fi';
import '../styles/admin.css';

export default function Admin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mode, setMode] = useState('artists'); // 'artists' or 'songs'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Data lists
    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);

    // Selected item for editing
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    // Check if user is admin
    const [isAdmin, setIsAdmin] = useState(null);

    let apiBase = '';
    try { apiBase = import.meta?.env?.VITE_API_URL || ''; } catch (e) { apiBase = ''; }
    const apiPrefix = apiBase ? apiBase.replace(/\/$/, '') : '';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Check admin status on mount
    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsAdmin(false);
                return;
            }

            try {
                // Try to access admin endpoint to verify admin status
                const res = await fetch(`${apiPrefix}/api/admin/artists`, {
                    headers: getAuthHeaders()
                });

                if (res.status === 403 || res.status === 401) {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                    // Load artists by default
                    const data = await res.json();
                    setArtists(data);
                }
            } catch (err) {
                setIsAdmin(false);
            }
        };

        checkAdmin();
    }, [apiPrefix]);

    // Load data when mode changes
    useEffect(() => {
        if (!isAdmin) return;

        const loadData = async () => {
            setLoading(true);
            setError('');
            setSelectedItem(null);
            setEditData({});

            try {
                const endpoint = mode === 'artists' ? '/api/admin/artists' : '/api/admin/songs';
                const res = await fetch(`${apiPrefix}${endpoint}`, {
                    headers: getAuthHeaders()
                });

                if (!res.ok) {
                    throw new Error(`Failed to load ${mode}`);
                }

                const data = await res.json();
                if (mode === 'artists') {
                    setArtists(data);
                } else {
                    setSongs(data);
                }
            } catch (err) {
                setError(`Kon ${mode} niet laden: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [mode, isAdmin, apiPrefix]);

    // Helper to get item ID (API returns 'artistId' for artists, 'songId' for songs)
    const getItemId = (item) => {
        if (mode === 'artists') {
            return item.id || item.artistId;
        } else {
            return item.id || item.songId;
        }
    };

    // Helper to get song title (API returns 'titel' in Dutch)
    const getSongTitle = (item) => {
        return item.titel || item.title || item.name;
    };

    // Filter items based on search
    const filteredItems = mode === 'artists'
        ? artists.filter(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        : songs.filter(s => {
            const title = getSongTitle(s) || '';
            const artist = s.artistName || '';
            return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   artist.toLowerCase().includes(searchQuery.toLowerCase());
        });

    // Select item for editing
    const handleSelectItem = async (item) => {
        setError('');
        setSuccess('');

        const itemId = getItemId(item);

        if (!itemId) {
            setSelectedItem(item);
            initializeEditData(item);
            return;
        }

        try {
            const endpoint = mode === 'artists'
                ? `/api/admin/artists/${itemId}`
                : `/api/admin/songs/${itemId}`;

            const res = await fetch(`${apiPrefix}${endpoint}`, {
                headers: getAuthHeaders()
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setSelectedItem({ ...item, id: itemId });
                    initializeEditData(item);
                    return;
                }
                throw new Error('Failed to load details');
            }

            const data = await res.json();
            setSelectedItem({ ...data, id: getItemId(data) || itemId });
            initializeEditData(data);
        } catch (err) {
            setSelectedItem({ ...item, id: itemId });
            initializeEditData(item);
        }
    };

    // Initialize edit data based on item
    const initializeEditData = (data) => {
        if (mode === 'artists') {
            setEditData({
                biography: data.biography || '',
                wiki: data.wiki || '',
                photo: data.photo || ''
            });
        } else {
            setEditData({
                lyrics: data.lyrics || '',
                imgUrl: data.imgUrl || '',
                youtube: data.youtube || ''
            });
        }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    // Save changes
    const handleSave = async () => {
        if (!selectedItem) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const itemId = selectedItem.id;
            const endpoint = mode === 'artists'
                ? `/api/admin/artists/${itemId}`
                : `/api/admin/songs/${itemId}`;

            const res = await fetch(`${apiPrefix}${endpoint}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(editData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to save');
            }

            setSuccess('Wijzigingen opgeslagen!');

            if (mode === 'artists') {
                setArtists(prev => prev.map(a =>
                    getItemId(a) === itemId ? { ...a, ...editData } : a
                ));
            } else {
                setSongs(prev => prev.map(s =>
                    getItemId(s) === itemId ? { ...s, ...editData } : s
                ));
            }

            setSelectedItem(prev => ({ ...prev, ...editData }));
        } catch (err) {
            setError('Kon niet opslaan: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setSelectedItem(null);
        setEditData({});
        setError('');
        setSuccess('');
    };

    // Render access denied
    if (isAdmin === false) {
        return (
            <div className="admin-page">
                <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="admin-main">
                    <div className="admin-content">
                        <div className="admin-access-denied">
                            <h2>Toegang geweigerd</h2>
                            <p>Je hebt geen admin rechten om deze pagina te bekijken.</p>
                            <p><a href="/login">Log in</a> met een admin account om verder te gaan.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Loading admin check
    if (isAdmin === null) {
        return (
            <div className="admin-page">
                <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="admin-main">
                    <div className="admin-content">
                        <div className="admin-loading">Laden...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="admin-main">
                <header className="admin-header">
                    <h1><FiSettings style={{ verticalAlign: 'middle', marginRight: 8 }} /> Admin Panel</h1>
                    <p>Beheer artiesten en nummers extra informatie</p>
                </header>

                {/* Mode Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${mode === 'artists' ? 'active' : ''}`}
                        onClick={() => setMode('artists')}
                    >
                        <FiUser style={{ verticalAlign: 'middle', marginRight: 6 }} /> Artiesten bewerken
                    </button>
                    <button
                        className={`admin-tab ${mode === 'songs' ? 'active' : ''}`}
                        onClick={() => setMode('songs')}
                    >
                        <FiMusic style={{ verticalAlign: 'middle', marginRight: 6 }} /> Nummers bewerken
                    </button>
                </div>

                <div className="admin-content">
                    {/* Messages */}
                    {error && <div className="admin-error">{error}</div>}
                    {success && <div className="admin-success">{success}</div>}

                    {/* Search */}
                    <div className="admin-search">
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder={mode === 'artists' ? 'Zoek artiest op naam...' : 'Zoek nummer op titel of artiest...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="admin-search-btn"
                            onClick={() => setSearchQuery('')}
                            style={{ display: searchQuery ? 'block' : 'none' }}
                        >
                            Wissen
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && <div className="admin-loading">Laden...</div>}

                    {/* List */}
                    {!loading && (
                        <ul className="admin-list">
                            {filteredItems.length === 0 && (
                                <li className="admin-empty">
                                    {searchQuery ? 'Geen resultaten gevonden' : `Geen ${mode} gevonden`}
                                </li>
                            )}
                            {filteredItems.map((item, index) => (
                                <li
                                    key={`${mode}-${getItemId(item)}-${index}`}
                                    className={`admin-list-item ${selectedItem?.id === getItemId(item) ? 'selected' : ''}`}
                                    onClick={() => handleSelectItem(item)}
                                >
                                    {mode === 'artists' && item.photo && (
                                        <img 
                                            src={item.photo} 
                                            alt={item.name}
                                            className="admin-list-item-photo"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    {mode === 'songs' && item.imgUrl && (
                                        <img 
                                            src={item.imgUrl} 
                                            alt={getSongTitle(item)}
                                            className="admin-list-item-photo"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                    <div className="admin-list-item-info">
                                        <span className="admin-list-item-title">
                                            {mode === 'artists' ? item.name : getSongTitle(item)}
                                        </span>
                                        {mode === 'songs' && (
                                            <span className="admin-list-item-subtitle">
                                                door {item.artistName || 'Onbekend'}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        className="admin-list-item-action"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectItem(item);
                                        }}
                                    >
                                        Bewerken
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Edit Form */}
                    {selectedItem && (
                        <div className="admin-edit-section">
                            <div className="admin-edit-header">
                                <h2>
                                    {mode === 'artists' ? <FiUser style={{ verticalAlign: 'middle', marginRight: 8 }} /> : <FiMusic style={{ verticalAlign: 'middle', marginRight: 8 }} />}
                                    {mode === 'artists' ? selectedItem.name : getSongTitle(selectedItem)} bewerken
                                </h2>
                                <button className="admin-edit-close" onClick={handleCancel}>
                                    <FiX style={{ verticalAlign: 'middle', marginRight: 4 }} /> Sluiten
                                </button>
                            </div>

                            <form className="admin-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                {/* Read-only fields */}
                                {mode === 'artists' ? (
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">
                                            Naam <span className="admin-form-hint">(alleen-lezen)</span>
                                        </label>
                                        <div className="admin-form-readonly">{selectedItem.name}</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">
                                                Titel <span className="admin-form-hint">(alleen-lezen)</span>
                                            </label>
                                            <div className="admin-form-readonly">{getSongTitle(selectedItem)}</div>
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">
                                                Artiest <span className="admin-form-hint">(alleen-lezen)</span>
                                            </label>
                                            <div className="admin-form-readonly">{selectedItem.artistName || 'Onbekend'}</div>
                                        </div>
                                    </>
                                )}

                                {/* Editable fields for Artists */}
                                {mode === 'artists' && (
                                    <>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Biografie</label>
                                            <textarea
                                                className="admin-form-textarea"
                                                value={editData.biography || ''}
                                                onChange={(e) => handleInputChange('biography', e.target.value)}
                                                placeholder="Voer de biografie van de artiest in..."
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Wikipedia Link</label>
                                            <input
                                                type="url"
                                                className="admin-form-input"
                                                value={editData.wiki || ''}
                                                onChange={(e) => handleInputChange('wiki', e.target.value)}
                                                placeholder="https://nl.wikipedia.org/wiki/..."
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Foto URL</label>
                                            <input
                                                type="url"
                                                className="admin-form-input"
                                                value={editData.photo || ''}
                                                onChange={(e) => handleInputChange('photo', e.target.value)}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                            {editData.photo && (
                                                <div className="admin-image-preview">
                                                    <img
                                                        src={editData.photo}
                                                        alt="Preview"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Editable fields for Songs */}
                                {mode === 'songs' && (
                                    <>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Songtekst (Lyrics)</label>
                                            <textarea
                                                className="admin-form-textarea"
                                                value={editData.lyrics || ''}
                                                onChange={(e) => handleInputChange('lyrics', e.target.value)}
                                                placeholder="Voer de songtekst in..."
                                                style={{ minHeight: '200px' }}
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Album Afbeelding URL</label>
                                            <input
                                                type="url"
                                                className="admin-form-input"
                                                value={editData.imgUrl || ''}
                                                onChange={(e) => handleInputChange('imgUrl', e.target.value)}
                                                placeholder="https://example.com/album.jpg"
                                            />
                                            {editData.imgUrl && (
                                                <div className="admin-image-preview">
                                                    <img
                                                        src={editData.imgUrl}
                                                        alt="Album preview"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="admin-form-group">
                                            <label className="admin-form-label">YouTube Link</label>
                                            <input
                                                type="url"
                                                className="admin-form-input"
                                                value={editData.youtube || ''}
                                                onChange={(e) => handleInputChange('youtube', e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Form Actions */}
                                <div className="admin-form-actions">
                                    <button
                                        type="submit"
                                        className="admin-btn-save"
                                        disabled={saving}
                                    >
                                        {saving ? 'Opslaan...' : <><FiSave style={{ verticalAlign: 'middle', marginRight: 6 }} /> Opslaan</>}
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-btn-cancel"
                                        onClick={handleCancel}
                                    >
                                        Annuleren
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
