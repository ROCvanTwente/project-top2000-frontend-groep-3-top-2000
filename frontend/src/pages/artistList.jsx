import React, { useCallback, useEffect, useState } from "react";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import { BASE_API_URL } from "../data/api-url";

const ARTIST_URL = `${BASE_API_URL}/api/Artist`;

const ArtistList = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const truncateBiography = (text, maxLength = 80) => {
        if (!text) return "Geen biografie beschikbaar";
        if (text.length <= maxLength) return text;
        return `${text.slice(0, maxLength).trim()}…`;
    };

    const fetchArtists = useCallback(async (signal) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(ARTIST_URL, { signal });
            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }

            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Unexpected response shape");
            }

            setArtists(data);
        } catch (err) {
            if (signal?.aborted || err?.name === "AbortError") return;
            setError(err?.message || "Kon artiesten niet laden.");
            setArtists([]);
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchArtists(controller.signal);
        return () => controller.abort();
    }, [fetchArtists]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-4" role="status" aria-live="polite">
                    Artiesten laden...
                </div>
            );
        }

        if (error) {
            return (
                <div className="alert alert-danger" role="alert">
                    Kon artiesten niet laden. {error}
                </div>
            );
        }

        if (!artists.length) {
            return (
                <div className="alert alert-info" role="status">
                    Geen artiesten gevonden.
                </div>
            );
        }

        return (
            <div className="d-grid gap-3">
                {artists.map((artist, index) => (
                    <ListTile
                        key={artist.artistId || `${artist.name}-${index}`}
                        position={null}
                        imagePath={artist.photo || undefined}
                        songName={artist.name}
                        artistName={truncateBiography(artist.biography)}
                        trend={null}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-100">
            <NavBar onMenuToggle={handleMenuToggle} />
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

            <main className="container py-4">
                <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
                    <div>
                        <h1 className="fs-2 mb-0">Artiesten</h1>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-dark mt-2 mt-md-0"
                        onClick={() => fetchArtists()}
                    >
                        Opnieuw laden
                    </button>
                </header>

                {renderContent()}
            </main>

            <Footer />
        </div>
    );
};

export default ArtistList;
