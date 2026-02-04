import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import "../styles/playlist.css";
import { BASE_API_URL } from "../data/api-url";
import { AnimatedBackground } from "../components/AnimatedBackground";

export const Playlist = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistDetail, setPlaylistDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showSongsOnMobile, setShowSongsOnMobile] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistNameInput, setPlaylistNameInput] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchPlaylists();
    } else {
      setIsLoggedIn(false);
    }
    setCheckingAuth(false);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Get API base URL
  const getApiBase = () => {
    return BASE_API_URL;
  };

  // Helper functions for search relevance scoring
  const normalize = (str) => str.toLowerCase().trim();

  const relevanceScore = (song, query) => {
    const normalisedSongTitle = normalize(song.titel);
    const normalisedArtistName = normalize(song.artistName);
    const normalisedQuery = normalize(query);

    // Check title first
    if (normalisedSongTitle === normalisedQuery) return 0; // exact match
    if (normalisedSongTitle.startsWith(normalisedQuery)) return 1; // starts with query
    if (normalisedSongTitle.includes(normalisedQuery)) return 2; // contains query

    // Check artist name
    if (normalisedArtistName === normalisedQuery) return 0; // exact match
    if (normalisedArtistName.startsWith(normalisedQuery)) return 1; // starts with query
    if (normalisedArtistName.includes(normalisedQuery)) return 2; // contains query

    return 3; // no match
  };

  // Search for songs by title or artist name, but only show songs
  const searchSongs = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query.trim());

      // Search both songs and artists
      const [songsRes, artistsRes] = await Promise.all([
        fetch(`/api/Song/search/${encodedQuery}`),
        fetch(`/api/Artist/search/${encodedQuery}`),
      ]);

      const songs = await songsRes.json();
      const artists = await artistsRes.json();

      // If artist(s) found, get all their songs
      let artistSongResults = [];
      if (Array.isArray(artists) && artists.length > 0) {
        // For each artist, fetch their songs
        const artistSongFetches = artists.map((artist) =>
          fetch(`/api/Artist/${artist.artistId}/songs`)
            .then((res) => res.json())
            .catch((err) => {
              console.error(
                `Failed to fetch songs for artist ${artist.artistId}:`,
                err,
              );
              return [];
            }),
        );
        const artistSongsArrays = await Promise.all(artistSongFetches);
        // Flatten arrays
        artistSongResults = artistSongsArrays.flat();
      }

      // Combine songs from title search and artist search, deduplicate by songId
      let allSongs = Array.isArray(songs) ? [...songs] : [];
      if (artistSongResults.length > 0) {
        const seen = new Set(allSongs.map((s) => s.songId));
        artistSongResults.forEach((song) => {
          if (!seen.has(song.songId)) {
            allSongs.push(song);
            seen.add(song.songId);
          }
        });
      }

      // Sort results by relevance
      const sortedResults = allSongs.sort((a, b) => {
        const scoreDiff = relevanceScore(a, query) - relevanceScore(b, query);
        if (scoreDiff !== 0) return scoreDiff;

        // Secondary sort by title length if relevance scores are equal
        return (a.titel || "").length - (b.titel || "").length;
      });

      setSearchResults(sortedResults);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search queries
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        searchSongs(searchQuery);
      }
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, "") : "";
      const url = (base || "") + "/api/Playlist";
      const token = localStorage.getItem("accessToken");
      console.log(token);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLoggedIn(false);
          setError("Your session has expired. Please log in again.");
          return;
        }
        throw new Error(`Failed to load playlists (${response.status})`);
      }

      const data = await response.json();
      setPlaylists(data || []);
      if (data && data.length > 0) {
        setSelectedPlaylist(data[0].playlistId);
        await fetchPlaylistDetail(data[0].playlistId);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load playlists");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistDetail = async (playlistId) => {
    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, "") : "";
      const url = (base || "") + `/api/Playlist/${playlistId}`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLoggedIn(false);
          setError("Your session has expired. Please log in again.");
          return;
        }
        throw new Error(`Failed to load playlist (${response.status})`);
      }

      const data = await response.json();
      setPlaylistDetail(data);
      setError(null);
    } catch (err) {
      setError("Failed to load playlist details");
      console.error(err);
    }
  };

  const handlePlaylistSelect = async (playlistId) => {
    setSelectedPlaylist(playlistId);
    await fetchPlaylistDetail(playlistId);
    setShowSongsOnMobile(true);
  };

  const handleBackToPlaylists = () => {
    setShowSongsOnMobile(false);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear results if query is too short
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    console.log("Playing song:", song);
    // TODO: Implement actual playback functionality
  };

  const handleRemoveSong = async (songId) => {
    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, "") : "";
      const url =
        (base || "") + `/api/Playlist/${selectedPlaylist}/songs/${songId}`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLoggedIn(false);
          setError("Your session has expired. Please log in again.");
          return;
        }
        throw new Error(`Failed to remove song (${response.status})`);
      }

      // Update local state
      setPlaylistDetail({
        ...playlistDetail,
        songs: playlistDetail.songs.filter((s) => s.songId !== songId),
      });
    } catch (err) {
      setError("Failed to remove song from playlist");
      console.error(err);
    }
  };

  const handleAddSong = () => {
    setShowSearchModal(true);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectSong = async (songId) => {
    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, "") : "";
      const url = (base || "") + `/api/Playlist/${selectedPlaylist}/songs`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ songId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLoggedIn(false);
          setError("Your session has expired. Please log in again.");
          return;
        }
        throw new Error(`Failed to add song (${response.status})`);
      }

      // Refresh playlist details to show the new song
      await fetchPlaylistDetail(selectedPlaylist);
      setError(null);
      handleCloseSearchModal();
    } catch (err) {
      setError("Failed to add song to playlist");
      console.error(err);
    }
  };

  const handleAddPlaylist = () => {
    setShowPlaylistModal(true);
    setPlaylistNameInput("");
  };

  const handleClosePlaylistModal = () => {
    setShowPlaylistModal(false);
    setPlaylistNameInput("");
  };

  const handleCreatePlaylist = async () => {
    if (!playlistNameInput || playlistNameInput.trim() === "") {
      return;
    }

    try {
      const apiBase = getApiBase();
      const base = apiBase ? apiBase.replace(/\/$/, "") : "";
      const url = (base || "") + "/api/Playlist";
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: playlistNameInput.trim() }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLoggedIn(false);
          setError("Your session has expired. Please log in again.");
          return;
        }
        throw new Error(`Failed to create playlist (${response.status})`);
      }

      const newPlaylist = await response.json();

      // Add the new playlist to the list and select it
      setPlaylists([...playlists, newPlaylist]);
      setSelectedPlaylist(newPlaylist.playlistId);
      await fetchPlaylistDetail(newPlaylist.playlistId);
      setError(null);
      handleClosePlaylistModal();
    } catch (err) {
      setError("Failed to create playlist");
      console.error(err);
    }
  };

  // Show login required message if not authenticated
  if (!checkingAuth && !isLoggedIn) {
    return (
      <div className="playlist-container d-flex justify-content-center align-items-center">
        <div>
          <div className="login-required">
            <h2>Inloggen vereist</h2>
            <p>Je moet ingelogd zijn om je afspeellijsten te bekijken.</p>
            <a href="/login" className="login-link">
              Ga naar inloggen
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="playlist-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (loading && !playlistDetail) {
    return (
      <div className="playlist-container">
        <p>Loading playlists...</p>
      </div>
    );
  }

  return (
    <AnimatedBackground>
      <div className="w-full min-h-screen flex flex-col">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <div className="playlist-container">
        <div className="playlist-wrapper">
          {/* Left sidebar - Playlists list */}
          <aside
            className={`playlists-sidebar ${showSongsOnMobile ? "hidden-mobile" : ""}`}
          >
            <h2 className="sidebar-title">afspeellijsten</h2>
            <div className="playlists-list">
              {playlists.map((playlist) => (
                <button
                  key={playlist.playlistId}
                  className={`playlist-item ${selectedPlaylist === playlist.playlistId ? "active" : ""}`}
                  onClick={() => handlePlaylistSelect(playlist.playlistId)}
                >
                  <span className="playlist-name">{playlist.name}</span>
                  <span className="playlist-count">
                    {playlist.songCount} nummers
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main content - Songs list */}
          <main
            className={`playlist-main ${!showSongsOnMobile ? "hidden-mobile" : ""}`}
          >
            <button
              className="back-button mobile-only"
              onClick={handleBackToPlaylists}
            >
              ← Back to Playlists
            </button>

            {error && <div className="error-message">{error}</div>}

            {playlistDetail ? (
              <>
                <div className="playlist-header">
                  <h1 className="playlist-title">{playlistDetail.name}</h1>
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

        <div
          className="playlist-floating-actions"
          aria-label="Playlist actions"
        >
          {playlistDetail && (
            <button
              className="add-song-button"
              onClick={handleAddSong}
              aria-label="Add song"
            >
              + Add Song
            </button>
          )}
          <button
            className="add-playlist-button"
            onClick={handleAddPlaylist}
            aria-label="Add playlist"
          >
            + Add Playlist
          </button>
        </div>

        {/* Search Modal */}
        {showSearchModal && (
          <div className="modal-overlay" onClick={handleCloseSearchModal}>
            <div
              className="modal-content p-4 rounded"
              style={{ backgroundColor: "#fff" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Search for a Song</h2>
                <button
                  className="modal-close"
                  onClick={handleCloseSearchModal}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  id="song-search-input"
                  name="songSearch"
                  className="search-input-playlist"
                  placeholder="Search by song title or artist..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  autoFocus
                />
                {searchLoading && (
                  <p className="search-loading">Searching...</p>
                )}
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
                          <p className="search-result-artist">
                            {song.artistName}
                          </p>
                          {song.releaseYear && (
                            <span className="search-result-year">
                              ({song.releaseYear})
                            </span>
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
                {!searchLoading &&
                  searchQuery.length >= 2 &&
                  searchResults.length === 0 && (
                    <p className="no-results">No songs found</p>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Add Playlist Modal */}
        {showPlaylistModal && (
          <div className="modal-overlay" onClick={handleClosePlaylistModal}>
            <div
              className="modal-content p-4 rounded"
              style={{ backgroundColor: "#fff" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Create New Playlist</h2>
                <button
                  className="modal-close"
                  onClick={handleClosePlaylistModal}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  id="playlist-name-input"
                  name="playlistName"
                  className="search-input-playlist"
                  placeholder="Enter playlist name..."
                  value={playlistNameInput}
                  onChange={(e) => setPlaylistNameInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreatePlaylist();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div
                className="modal-footer"
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  padding: "15px",
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={handleClosePlaylistModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreatePlaylist}
                  disabled={!playlistNameInput.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </AnimatedBackground>
  );
};
