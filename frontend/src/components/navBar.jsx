import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./navBar.css";
import { BASE_API_URL } from '../data/api-url';


export default function NavBar({ onMenuToggle }) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchResults([]);
    }
  };

  const normalize = (str) => str.toLowerCase().trim();

  const getDisplayText = (item) => {
    return item.type === "song" ? item.titel : item.name;
  };

  const relevanceScore = (item, query) => {
    const text = normalize(getDisplayText(item));
    const q = normalize(query);

    if (text === q) return 0; // exact match
    if (text.startsWith(q)) return 1; // starts with query
    if (text.includes(q)) return 2; // contains query
    return 3; // no match
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query.trim());

      // Search both songs and artists
      const [songsRes, artistsRes] = await Promise.all([
        fetch(`${BASE_API_URL}/api/Song/search/${encodedQuery}`),
        fetch(`${BASE_API_URL}/api/Artist/search/${encodedQuery}`),
      ]);

      const songs = await songsRes.json();
      const artists = await artistsRes.json();

      // Combine results and normalize an `id` field: songs use `songId`, artists use `artistId`
      const combinedResults = [
        ...(Array.isArray(songs)
          ? songs.map((s) => ({ ...s, type: "song", id: s.songId }))
          : []),
        ...(Array.isArray(artists)
          ? artists.map((a) => ({ ...a, type: "artist", id: a.artistId }))
          : []),
      ];

      // Sort results by relevance
      const sortedResults = combinedResults.sort((a, b) => {
        const scoreDiff = relevanceScore(a, query) - relevanceScore(b, query);
        if (scoreDiff !== 0) return scoreDiff;

        return getDisplayText(a).length - getDisplayText(b).length;
      });

      setSearchResults(sortedResults);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typing with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    performSearch(searchQuery);
  };

  const [accountPath, setAccountPath] = useState("/login");
  const [accountEmail, setAccountEmail] = useState(null);

  useEffect(() => {
    const check = () => {
      const token =
        typeof window !== "undefined" && localStorage.getItem("accessToken");
      const email =
        typeof window !== "undefined" && localStorage.getItem("userEmail");
      if (token && email) {
        setAccountPath("/account");
        setAccountEmail(email);
      } else {
        setAccountPath("/login");
        setAccountEmail(null);
      }
    };

    check();
    const onStorage = (e) => {
      if (e.key === "accessToken" || e.key === "userEmail" || e.key === null)
        check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <nav className="navbar  sticky-top ">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              color="#fff"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link className="navbar-brand" to={"/"}>
            <img
              src="/top-2000-logo-empty.png"
              alt="Top 2000 logo"
              width={100}
            ></img>
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <input
              className="search-input"
              type="search"
              placeholder="Zoek nummers of artiesten..."
              aria-label="Zoeken"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchToggle}
            />
            <button
              className="search-icon-btn"
              onClick={handleSearchSubmit}
              type="submit"
              aria-label="Search"
              disabled={isLoading}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>

            {searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.slice(0, 5).map((result, index) => (
                  <Link
                    key={index}
                    to={
                      result.type === "song"
                        ? `/song/${result.id}`
                        : `/artist/${result.id}`
                    }
                    className="search-result-item"
                    onClick={() => {
                      setSearchQuery(
                        result.type === "song" ? result.titel : result.name,
                      );
                      setSearchResults([]);
                    }}
                  >
                    {result.type === "song" ? (
                      <div className="result-content">
                        <span className="result-song">{result.titel}</span>
                        <span className="result-artist">
                          {result.artistName}
                        </span>
                      </div>
                    ) : (
                      <div className="result-content">
                        <span className="result-artist">🎤 {result.name}</span>
                        {result.genre && (
                          <span className="result-genre">{result.genre}</span>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Account icon on the far right */}
        <Link
          to={accountPath}
          className="btn btn-link account-btn"
          aria-label="Account"
          title={accountEmail ? `Ingelogd als ${accountEmail}` : "Account"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            color="#fff"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>
    </nav>
  );
}
