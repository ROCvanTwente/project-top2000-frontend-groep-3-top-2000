import React, { useState, useEffect } from 'react'
import '../styles/stats.css'
import { BASE_API_URL } from "../data/api-url";
import NavBar from '../components/navBar';
import { Sidebar } from '../components/sidebar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Footer } from "../components/footer";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement);

export const StatsPage = () => {
    //default year is 2024 bc thats where we have most data
    const [year, setYear] = useState(new Date(2024, 0, 1).getFullYear())
    const [stats, setStats] = useState({
        drops: [],
        rises: [],
        everPresent: [],
        new: [],
        dropouts: [],
        reEntries: [],
        unchanged: [],
        consecutiveArtistPositions: [],
        oneTimers: [],
        topArtists: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };


    // Helper function to extract displayable text from various data formats
    const getDisplayText = (item) => {
        if (!item) return null;
        if (typeof item === 'string') return item;
        if (item.artist) return item.artist;
        if (item.titel) return item.titel;
        if (item.name) return item.name;
        if (item.songName) return item.songName;
        if (item.title) return item.title;
        if (item.artistName) return item.artistName;
        return null;
    };

    useEffect(() => {
        fetchAllStats()
    }, [year])

    const fetchAllStats = async () => {
        setLoading(true)
        setError(null)
        try {
            const baseUrl = BASE_API_URL;

            const [
                dropsRes,
                risesRes,
                everPresentRes,
                newRes,
                dropoutsRes,
                reEntriesRes,
                unchangedRes,
                consecutiveRes,
                oneTimersRes,
                topArtistsRes
            ] = await Promise.all([
                fetch(`${baseUrl}/api/Stats/drops?year=${year}`),
                fetch(`${baseUrl}/api/Stats/rises?year=${year}`),
                fetch(`${baseUrl}/api/Stats/ever-present`),
                fetch(`${baseUrl}/api/Stats/new?year=${year}`),
                fetch(`${baseUrl}/api/Stats/dropouts?year=${year}`),
                fetch(`${baseUrl}/api/Stats/re-entries?year=${year}`),
                fetch(`${baseUrl}/api/Stats/unchanged?year=${year}`),
                fetch(`${baseUrl}/api/Stats/consecutive-artist-positions?year=${year}`),
                fetch(`${baseUrl}/api/Stats/one-timers`),
                fetch(`${baseUrl}/api/Stats/top-artists?year=${year}&take=10`)
            ])

            const data = {
                drops: await dropsRes.json(),
                rises: await risesRes.json(),
                everPresent: await everPresentRes.json(),
                new: await newRes.json(),
                dropouts: await dropoutsRes.json(),
                reEntries: await reEntriesRes.json(),
                unchanged: await unchangedRes.json(),
                consecutiveArtistPositions: await consecutiveRes.json(),
                oneTimers: await oneTimersRes.json(),
                topArtists: await topArtistsRes.json()
            }

            setStats(data)
        } catch (err) {
            setError('Failed to load statistics')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="stats-page"><div className="loading">Statistieken laden...</div></div>
    }

    // Voorbereiding chartgegevens
    const topArtistsData = {
        labels: stats.topArtists?.slice(0, 10)?.map((a, i) => `${i + 1}. ${getDisplayText(a)}`) || [],
        datasets: [{
            label: 'Top Artiesten',
            data: stats.topArtists?.slice(0, 10)?.map((a) => a.songCount || 0) || [],
            backgroundColor: 'rgba(176, 25, 32, 0.7)',
            borderColor: 'rgba(176, 25, 32, 1)',
            borderWidth: 2,
        }]
    };

    const statsCountData = {
        labels: ['Stijgers', 'Dalers', 'Nieuw', 'Eeuwig', 'Éénmalig'],
        datasets: [{
            data: [
                stats.rises?.length || 0,
                stats.drops?.length || 0,
                stats.new?.length || 0,
                stats.everPresent?.length || 0,
                stats.oneTimers?.length || 0
            ],
            backgroundColor: [
                'rgba(34, 197, 94, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(255, 140, 0, 0.7)',
            ],
            borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(255, 140, 0, 1)',
            ],
            borderWidth: 2,
        }]
    };

    return (
        <div>
            <NavBar onMenuToggle={handleMenuToggle} />
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
            <div className="stats-page">
                <div className="stats-header">
                    <div className="header-content">
                        <h1>TOP 2000 STATISTIEKEN</h1>
                        <p className="header-subtitle">Ontdek de geschiedenis van jouw favoriete liedjes</p>
                    </div>
                    <div className="year-selector">
                        <label htmlFor="year">Kies een jaar: </label>
                        <input
                            type="number"
                            id="year"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            min="2000"
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Charts Section */}
                <div className="charts-section">
                    <div className="chart-container wide">
                        <h2>Top 10 Artiesten</h2>
                        <Bar data={topArtistsData} options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { display: false },
                                tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                            },
                            scales: {
                                y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                                x: { ticks: { color: '#fff' }, grid: { display: false } }
                            }
                        }} />
                    </div>

                    <div className="chart-container">
                        <h2>📊 Statistieken Overzicht</h2>
                        <Pie data={statsCountData} options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: { labels: { color: '#fff' }, position: 'bottom' },
                                tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                            }
                        }} />
                    </div>
                </div>

                <div className="stats-grid">
                    {/* Top Artists */}
                    <div className="stat-card">
                        <h2>🎤 Top Artiesten</h2>
                        <div className="stat-list">
                            {Array.isArray(stats.topArtists) && stats.topArtists.slice(0, 10).map((artist, idx) => {
                                const artistName = getDisplayText(artist);
                                return artistName ? (
                                    <div key={idx} className="stat-item stat-item-detailed">
                                        <div className="stat-item-header">
                                            <span className="rank">#{idx + 1}</span>
                                            <span className="name">{artistName}</span>
                                        </div>
                                        {(artist.songCount || artist.bestPosition) && (
                                            <div className="stat-item-meta">
                                                {artist.songCount && <span className="meta-badge">{artist.songCount} nummers</span>}
                                                {artist.bestPosition && <span className="meta-badge highlight">Best: #{artist.bestPosition}</span>}
                                            </div>
                                        )}
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.topArtists) || stats.topArtists.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Rises */}
                    <div className="stat-card">
                        <h2>📈 Grootste Stijgers ({stats.rises?.length || 0})</h2>
                        <div className="stat-list">
                            {Array.isArray(stats.rises) && stats.rises.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                        {song.rise && <span className="positive">+{song.rise}</span>}
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.rises) || stats.rises.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Drops */}
                    <div className="stat-card">
                        <h2>Grootste Dalers ({stats.drops?.length || 0})</h2>
                        <div className="stat-list">
                            {Array.isArray(stats.drops) && stats.drops.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                        {song.drop && <span className="negative">-{song.drop}</span>}
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.drops) || stats.drops.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* New Songs */}
                    <div className="stat-card">
                        <h2>Nieuwe Nummers ({stats.new?.length || 0})</h2>
                        <div className="stat-list">
                            {Array.isArray(stats.new) && stats.new.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.new) || stats.new.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Ever Present */}
                    <div className="stat-card">
                        <h2>Altijd Aanwezig ({stats.everPresent?.length || 0})</h2>
                        <p className="stat-description">Nummers die ieder jaar in de Top 2000 voorkomen</p>
                        <div className="stat-list">
                            {Array.isArray(stats.everPresent) && stats.everPresent.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.everPresent) || stats.everPresent.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* One Timers */}
                    <div className="stat-card">
                        <h2>Eenmalig ({stats.oneTimers?.length || 0})</h2>
                        <p className="stat-description">Nummers die slechts één keer voorkomen</p>
                        <div className="stat-list">
                            {Array.isArray(stats.oneTimers) && stats.oneTimers.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.oneTimers) || stats.oneTimers.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Re-entries */}
                    <div className="stat-card">
                        <h2>Terugkeerders ({stats.reEntries?.length || 0})</h2>
                        <p className="stat-description">Nummers die terugkomen in de Top 2000</p>
                        <div className="stat-list">
                            {Array.isArray(stats.reEntries) && stats.reEntries.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.reEntries) || stats.reEntries.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Dropouts */}
                    <div className="stat-card">
                        <h2>Uitschakelingen ({stats.dropouts?.length || 0})</h2>
                        <p className="stat-description">Nummers die niet meer in de Top 2000 voorkomen</p>
                        <div className="stat-list">
                            {Array.isArray(stats.dropouts) && stats.dropouts.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.dropouts) || stats.dropouts.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Unchanged */}
                    <div className="stat-card">
                        <h2>Onveranderd ({stats.unchanged?.length || 0})</h2>
                        <p className="stat-description">Nummers op dezelfde positie</p>
                        <div className="stat-list">
                            {Array.isArray(stats.unchanged) && stats.unchanged.slice(0, 5).map((song, idx) => {
                                const songName = getDisplayText(song);
                                return songName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{songName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.unchanged) || stats.unchanged.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>

                    {/* Consecutive Artist Positions */}
                    <div className="stat-card">
                        <h2>Opeenvolgende Posities ({stats.consecutiveArtistPositions?.length || 0})</h2>
                        <p className="stat-description">Artiesten met opeenvolgende nummers in ranking</p>
                        <div className="stat-list">
                            {Array.isArray(stats.consecutiveArtistPositions) && stats.consecutiveArtistPositions.slice(0, 5).map((item, idx) => {
                                const itemName = getDisplayText(item);
                                return itemName ? (
                                    <div key={idx} className="stat-item">
                                        <span className="name">{itemName}</span>
                                    </div>
                                ) : null;
                            })}
                            {(!Array.isArray(stats.consecutiveArtistPositions) || stats.consecutiveArtistPositions.length === 0) && (
                                <p className="empty-state">Geen gegevens beschikbaar</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}
