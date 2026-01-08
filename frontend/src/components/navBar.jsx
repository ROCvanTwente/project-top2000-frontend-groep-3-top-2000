import React, { useState } from 'react'
import './navBar.css'

export default function NavBar({ onMenuToggle }) {
    const [searchExpanded, setSearchExpanded] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchToggle = () => {
        setSearchExpanded(!searchExpanded)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        console.log('Search for:', searchQuery)
    }

    return (
        <nav className="navbar bg-body-tertiary sticky-top">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-link"
                        onClick={onMenuToggle}
                        aria-label="Toggle menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <a className="navbar-brand mb-0">TOP 2000</a>
                </div>

                <form
                    className={`search-form ${searchExpanded ? 'expanded' : ''}`}
                    role="search"
                    onSubmit={handleSearchSubmit}
                >
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Search songs or artists..."
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus={searchExpanded}
                    />
                    {searchExpanded && (
                        <button className="btn-search-submit" type="submit">Search</button>
                    )}
                </form>

                <button
                    className="btn btn-link search-toggle"
                    onClick={handleSearchToggle}
                    aria-label="Toggle search"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>
        </nav>
    )
}
