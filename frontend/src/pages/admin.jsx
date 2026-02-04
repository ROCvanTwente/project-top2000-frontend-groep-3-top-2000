import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import { Sidebar } from '../components/sidebar';
import { Footer } from '../components/footer';
import { FiSettings, FiUser, FiMusic, FiX, FiSave } from 'react-icons/fi';
import '../styles/admin.css';
import { BASE_API_URL } from '../data/api-url';
import { AnimatedBackground } from '../components/AnimatedBackground';

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

    let apiBase = BASE_API_URL;
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
                // Check user profile to verify admin status
                const res = await fetch(`${apiPrefix}/api/Account/profile`, {
                    headers: getAuthHeaders()
                });


                if (!res.ok) {
                    setIsAdmin(false);
                    return;
                }

                const data = await res.json();
                const isAdminUser = data.roles && Array.isArray(data.roles) && data.roles.includes('Admin');
                setIsAdmin(isAdminUser);

                if (isAdminUser) {
                    // Load artists by default
                    try {
                        const artistRes = await fetch(`${apiPrefix}/api/Artist`, {
                            headers: getAuthHeaders()
                        });
                        if (artistRes.ok) {
                            const artistData = await artistRes.json();
                            setArtists(artistData);
                        }
                    } catch (err) {
                        console.error('Error loading artists:', err);
                    }
                }
            } catch (err) {
                console.error('Error checking admin status:', err);
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
                const endpoint = mode === 'artists' ? '/api/Artist' : '/api/Song';
                const res = await fetch(`${apiPrefix}${endpoint}`, {
                    headers: getAuthHeaders()
                });

                if (!res.ok) {
                    console.error(`Failed to load ${mode}: ${res.status}`);
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
        if (!item) return null;
        if (mode === 'artists') {
            return item.artistId || item.id;
        } else {
            return item.songId || item.id;
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
            console.error('No item ID found', item);
            setError('Kon item ID niet bepalen');
            return;
        }

        // Set selected item immediately with current data
        setSelectedItem({ ...item, id: itemId });
        initializeEditData(item);

        // Try to fetch more detailed info
        try {
            const endpoint = mode === 'artists'
                ? `/api/Artist/${itemId}`
                : `/api/Song/${itemId}`;

            const res = await fetch(`${apiPrefix}${endpoint}`, {
                headers: getAuthHeaders()
            });
            console.log('Fetch item details response status:', res.status);
            console.log('Fetch item details response:', res);

            if (res.ok) {
                const data = await res.json();
                setSelectedItem({ ...data, id: getItemId(data) || itemId });
                initializeEditData(data);
            } else {
                console.error(`Failed to fetch details: ${res.status}`);
            }
        } catch (err) {
            console.error('Error fetching item details:', err);
            // Continue with what we have
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

            console.log('Saving to url:', `${apiPrefix}${endpoint}`);
            console.log('Data being saved:', editData);
            const res = await fetch(`${apiPrefix}${endpoint}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(editData)
            });
            console.log('Save response status:', res.status);
            console.log('Save response:', res);

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
            console.error('Error saving changes:', err);
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
            <AnimatedBackground>
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
            </AnimatedBackground>
        );
    }

    // Loading admin check
    if (isAdmin === null) {
        return (
            <AnimatedBackground>
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
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <div className="admin-page">
                <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="admin-main">
                    <header className="admin-header">
                        <h1><FiSettings style={{ verticalAlign: 'middle', marginRight: 8 }} /> Admin Paneel</h1>
                        <p>Beheer artiesten en nummers en extra informatie</p>
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
                            {filteredItems.map((item, index) => {
                                const itemId = getItemId(item);
                                const isSelected = selectedItem && selectedItem.id === itemId;
                                return (
                                    <li
                                        key={`${mode}-${itemId}-${index}`}
                                        className={`admin-list-item ${isSelected ? 'selected' : ''}`}
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
                                );
                            })}
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
        </AnimatedBackground>
    );
}
