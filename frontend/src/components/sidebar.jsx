import React from "react";
import "./sidebar.css";

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/songlist">Top 2000</a>
            </li>
            <li>
              <a href="/Artistlist">Artiesten Lijst</a>
            </li>
            <li>
              <a href="/songlist">Nummers Lijst</a>
            </li>
            <li>
              <a href="/FAQ">FAQ</a>
            </li>
            <li>
              <a href="/geschiedenis">Geschiedenis</a>
            </li>
            <li>
              <a href="/playlist">Playlist</a>
            </li>
            <li>
              <a href="/admin">Admin</a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};
