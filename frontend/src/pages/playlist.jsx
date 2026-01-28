import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/navBar'
import { Sidebar } from '../components/sidebar'
import '../styles/playlist.css'

export const Playlist = () => {
    const navigate = useNavigate()
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [playlistDetail, setPlaylistDetail] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)
    const [showSongsOnMobile, setShowSongsOnMobile] = useState(false)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            setIsLoggedIn(true)
            fetchPlaylists()
        } else {
            setIsLoggedIn(false)
        }
        setCheckingAuth(false)
    }, [])

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleCloseSidebar = () => {
        setSidebarOpen(false)
    }

    // Get API base URL
    const getApiBase = () => {
        return "http://top2000api.runasp.net/";
    }

    const searchSongs = async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([])
            return
        }

        setSearchLoading(true)
        try {
            const apiBase = getApiBase()
            const base = apiBase ? apiBase.replace(/\/$/, '') : ''
            const url = (base || '') + `/api/Song/search/${encodeURIComponent(query.trim())}`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to search songs (${response.status})`)
            }

            const data = await response.json()
            setSearchResults(data || [])
        } catch (err) {
            console.error('Search error:', err)
            setSearchResults([])
        } finally {
            setSearchLoading(false)
        }
    }

    // Debounce search queries
    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (searchQuery && searchQuery.trim().length >= 2) {
                searchSongs(searchQuery)
            }
        }, 250)

        return () => clearTimeout(delayTimer)
    }, [searchQuery])

    const fetchPlaylists = async () => {
        setLoading(true)
        try {
            const apiBase = getApiBase()
            const base = apiBase ? apiBase.replace(/\/$/, '') : ''
            const url = (base || '') + '/api/Playlist'
            const token = localStorage.getItem('accessToken')
            console.log(token);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    setIsLoggedIn(false)
                    setError('Your session has expired. Please log in again.')
                    return
                }
                throw new Error(`Failed to load playlists (${response.status})`)
            }

            const data = await response.json()
            setPlaylists(data || [])
            if (data && data.length > 0) {
                setSelectedPlaylist(data[0].playlistId)
                await fetchPlaylistDetail(data[0].playlistId)
            }
            setError(null)
        } catch (err) {
            setError('Failed to load playlists')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchPlaylistDetail = async (playlistId) => {
        try {
            const apiBase = getApiBase()
            const base = apiBase ? apiBase.replace(/\/$/, '') : ''
            const url = (base || '') + `/api/Playlist/${playlistId}`
            const token = localStorage.getItem('accessToken')

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    setIsLoggedIn(false)
                    setError('Your session has expired. Please log in again.')
                    return
                }
                throw new Error(`Failed to load playlist (${response.status})`)
            }

            const data = await response.json()
            setPlaylistDetail(data)
            setError(null)
        } catch (err) {
            setError('Failed to load playlist details')
            console.error(err)
        }
    }

    const handlePlaylistSelect = async (playlistId) => {
        setSelectedPlaylist(playlistId)
        await fetchPlaylistDetail(playlistId)
        setShowSongsOnMobile(true)
    }

    const handleBackToPlaylists = () => {
        setShowSongsOnMobile(false)
    }

    const handleSearchInputChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)

        // Clear results if query is too short
        if (!query || query.trim().length < 2) {
            setSearchResults([])
            setSearchLoading(false)
        }
    }

    const handlePlaySong = (song) => {
        console.log('Playing song:', song)
        // TODO: Implement actual playback functionality
    }

    const handleRemoveSong = async (songId) => {
        try {
            const apiBase = getApiBase()
            const base = apiBase ? apiBase.replace(/\/$/, '') : ''
            const url = (base || '') + `/api/Playlist/${selectedPlaylist}/songs/${songId}`
            const token = localStorage.getItem('accessToken')

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    setIsLoggedIn(false)
                    setError('Your session has expired. Please log in again.')
                    return
                }
                throw new Error(`Failed to remove song (${response.status})`)
            }

            // Update local state
            setPlaylistDetail({
                ...playlistDetail,
                songs: playlistDetail.songs.filter(s => s.songId !== songId)
            })
        } catch (err) {
            setError('Failed to remove song from playlist')
            console.error(err)
        }
    }

    const handleAddSong = () => {
        setShowSearchModal(true)
        setSearchQuery('')
        setSearchResults([])
    }

    const handleCloseSearchModal = () => {
        setShowSearchModal(false)
        setSearchQuery('')
        setSearchResults([])
    }

    const handleSelectSong = async (songId) => {
        try {
            const apiBase = getApiBase()
            const base = apiBase ? apiBase.replace(/\/$/, '') : ''
            const url = (base || '') + `/api/Playlist/${selectedPlaylist}/songs`
            const token = localStorage.getItem('accessToken')

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ songId })
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    setIsLoggedIn(false)
                    setError('Your session has expired. Please log in again.')
                    return
                }
                throw new Error(`Failed to add song (${response.status})`)
            }

            // Refresh playlist details to show the new song
            await fetchPlaylistDetail(selectedPlaylist)
            setError(null)
            handleCloseSearchModal()
        } catch (err) {
            setError('Failed to add song to playlist')
            console.error(err)
        }
    }

    const handleAddPlaylist = async () => {
        const playlistName = prompt('Enter playlist name:')

        if (!playlistName || playlistName.trim() === '') {
            return
        }

        try {
            const apiBase = getApiBase()
            const base = apiBase ? apiBase.replace(/\/$/, '') : ''
            const url = (base || '') + '/api/Playlist'
            const token = localStorage.getItem('accessToken')

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: playlistName.trim() })
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    setIsLoggedIn(false)
                    setError('Your session has expired. Please log in again.')
                    return
                }
                throw new Error(`Failed to create playlist (${response.status})`)
            }

            const newPlaylist = await response.json()

            // Add the new playlist to the list and select it
            setPlaylists([...playlists, newPlaylist])
            setSelectedPlaylist(newPlaylist.playlistId)
            await fetchPlaylistDetail(newPlaylist.playlistId)
            setError(null)
        } catch (err) {
            setError('Failed to create playlist')
            console.error(err)
        }
    }

    // Show login required message if not authenticated
    if (!checkingAuth && !isLoggedIn) {
        return (
            <div className="playlist-container">
                <div className="login-required">
                    <h2>Login Required</h2>
                    <p>You must be logged in to access your playlists.</p>
                    <a href="/login" className="login-link">Go to Login Page</a>
                </div>
            </div>
        )
    }

    if (checkingAuth) {
        return <div className="playlist-container"><p>Checking authentication...</p></div>
    }

    if (loading && !playlistDetail) {
        return <div className="playlist-container"><p>Loading playlists...</p></div>
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-100">
            <NavBar onMenuToggle={handleMenuToggle} />
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
            <div className="playlist-container">
                <div className="playlist-wrapper">
                    {/* Left sidebar - Playlists list */}
                    <aside className={`playlists-sidebar ${showSongsOnMobile ? 'hidden-mobile' : ''}`}>
                        <h2 className="sidebar-title">playlists</h2>
                        <div className="playlists-list">
                            {playlists.map((playlist) => (
                                <button
                                    key={playlist.playlistId}
                                    className={`playlist-item ${selectedPlaylist === playlist.playlistId ? 'active' : ''}`}
                                    onClick={() => handlePlaylistSelect(playlist.playlistId)}
                                >
                                    <span className="playlist-name">{playlist.name}</span>
                                    <span className="playlist-count">{playlist.songCount} nummers</span>
                                </button>
                            ))}
                        </div>
                        <button className="add-playlist-button" onClick={handleAddPlaylist} aria-label="Add new playlist">
                            + Add Playlist
                        </button>
                    </aside>

                    {/* Main content - Songs list */}
                    <main className={`playlist-main ${!showSongsOnMobile ? 'hidden-mobile' : ''}`}>
                        <button className="back-button mobile-only" onClick={handleBackToPlaylists}>
                            ← Back to Playlists
                        </button>

                        {error && <div className="error-message">{error}</div>}

                        {playlistDetail ? (
                            <>
                                <div className="playlist-header">
                                    <h1 className="playlist-title">{playlistDetail.name}</h1>
                                    <button className="add-song-button" onClick={handleAddSong}>
                                        + Add Song
                                    </button>
                                </div>
                                <div className="songs-list">
                                    {playlistDetail.songs.map((song) => (
                                        <div key={song.songId} className="song-item">
                                            <div className="song-info">
                                                <h3 className="song-title">{song.titel}</h3>
                                                <p className="song-artist">{song.artistName}</p>
                                            </div>
                                            <div className="song-controls">
                                                <span className="song-duration">{song.duration}</span>
                                                <button
                                                    className="play-button"
                                                    onClick={() => handlePlaySong(song)}
                                                    aria-label={`Play ${song.title}`}
                                                >
                                                    ▶
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="no-playlist">Select a playlist to view songs</p>
                        )}
                    </main>
                </div>

                {/* Floating action button for mobile */}
                <button className="fab-add-playlist" onClick={handleAddPlaylist} aria-label="Add new playlist">
                    +
                </button>

                {/* Search Modal */}
                {showSearchModal && (
                    <div className="modal-overlay" onClick={handleCloseSearchModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Search for a Song</h2>
                                <button className="modal-close" onClick={handleCloseSearchModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    id="song-search-input"
                                    name="songSearch"
                                    className="search-input-playlist"
                                    placeholder="Search by song title..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    autoFocus
                                />
                                {searchLoading && <p className="search-loading">Searching...</p>}
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map((song) => (
                                            <div
                                                key={song.songId}
                                                className="search-result-item"
                                                onClick={() => handleSelectSong(song.songId)}
                                            >
                                                <div className="search-result-info">
                                                    <h4 className="search-result-title">{song.titel}</h4>
                                                    <p className="search-result-artist">{song.artistName}</p>
                                                    {song.releaseYear && (
                                                        <span className="search-result-year">({song.releaseYear})</span>
                                                    )}
                                                </div>
                                                {song.imgUrl && (
                                                    <img
                                                        src={song.imgUrl}
                                                        alt={song.titel}
                                                        className="search-result-img"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!searchLoading && searchQuery.length >= 2 && searchResults.length === 0 && (
                                    <p className="no-results">No songs found</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
