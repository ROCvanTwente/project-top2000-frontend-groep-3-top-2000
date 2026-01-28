import React, { useState, useEffect } from "react";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import { Carousel } from "../components/carousel";
import { Link } from "react-router-dom";
import { BASE_API_URL } from "../data/api-url";

const Homepage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_API_URL}/api/Top2000/top10?year=2024`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched top songs data:", data);
        setSongs(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching top songs:", err);
        setError("Failed to load top songs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSongs();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
        <Carousel
          items={songs.slice(0, 3).map(song => ({
            image: song.thumbnail,
            href: `/song/${song.songId}`,
            alt: song.titel
          }))}
          carouselId="myCarousel"
        />

        {loading && (
          <div className="w-full max-w-4xl p-4 text-center">
            <p className="text-lg text-gray-600">Loading top songs...</p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-4xl p-4 text-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && songs.length === 0 && (
          <div className="w-full max-w-4xl p-4 text-center">
            <p className="text-lg text-gray-600">No songs found.</p>
          </div>
        )}

        {!loading && !error && songs.length > 0 && (
          <div className="w-full max-w-4xl">
            {songs.map((song) => (
              <Link
                key={`${song.songId}-${song.position}`}
                to={`/song/${song.songId}`}
                className="block mb-2"
              >
                <ListTile
                  position={song.position}
                  imagePath={song.artistImage}
                  songName={song.titel}
                  artistName={song.artist}
                  trend={song.trend}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
