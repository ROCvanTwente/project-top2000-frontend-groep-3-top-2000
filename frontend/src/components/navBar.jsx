import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navBar.css";

export default function NavBar({ onMenuToggle }) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
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
    // update if other tabs change auth
    const onStorage = (e) => {
      if (e.key === "accessToken" || e.key === "userEmail" || e.key === null)
        check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <nav className="navbar bg-body-tertiary sticky-top">
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
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <a className="navbar-brand mb-0">TOP 2000</a>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(searchQuery);
          }}
        >
          <input
            className="search-input"
            type="search"
            placeholder="Search songs or artists..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // autoFocus={searchExpanded}
          />

          <button
            className="btn btn-link search-toggle"
            onClick={handleSearchSubmit}
            type="button"
            aria-label="Search"
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
        </form>

        {/* Account icon on the far right */}
        <Link
          to={accountPath}
          className="btn btn-link account-btn"
          aria-label="Account"
          title={accountEmail ? `Signed in as ${accountEmail}` : "Account"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>
    </nav>
  );
}
