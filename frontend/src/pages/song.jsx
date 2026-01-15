import React, { useState } from "react";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";
import "./song.css";

const Song = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Hard-coded data (later te vervangen door API call)
  const songData = {
    name: "SONG NAME",
    artist: "ARTIST NAME",
    year: 1990,
    image: "/example.png",
    spotifyUrl: "https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC", // TODO: Replace with API data
    years: [
      { year: 2025, weeks: 1, position: 1, trend: null },
      { year: 2024, weeks: 24, position: 12, trend: "up" },
      { year: 2023, weeks: 24, position: 12, trend: "down" },
      { year: 2022, weeks: 24, position: 12, trend: "up" },
    ],
  };
  //test
  const getTrendIcon = (trend) => {
    if (trend === "up") return "▲";
    if (trend === "down") return "▼";
    return null;
  };

  const getTrendClass = (trend) => {
    if (trend === "up") return "trend-up";
    if (trend === "down") return "trend-down";
    return "";
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="flex-1">
        <div className="song-page">
          <div className="song-container">
            {/* Desktop Layout */}
            <div className="song-content-desktop">
              {/* Left side - Album cover and song info */}
              <div className="song-left">
                <div className="song-cover">
                  <img src={songData.image} alt={songData.name} />
                </div>
                <div className="song-info">
                  <h1 className="song-title">{songData.name}</h1>
                  <p className="song-meta">
                    {songData.artist} - {songData.year}
                  </p>
                </div>
                <button className="youtube-btn">
                  <span className="youtube-icon">▶</span> Youtube
                </button>
                <iframe
                  src={songData.spotifyUrl}
                  width="600"
                  height="380"
                  frameBorder="0"
                  allowTransparency="true"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Player"
                ></iframe>
              </div>

              {/* Right side - Year statistics */}
              <div className="song-right">
                {songData.years.map((yearData, index) => (
                  <div key={index} className="year-row">
                    <span className="year-label">{yearData.year}</span>
                    <span className="year-weeks">{yearData.weeks}</span>
                    <div
                      className={`year-position ${getTrendClass(
                        yearData.trend
                      )}`}
                    >
                      <span className="position-number">
                        {yearData.position}
                      </span>
                      {yearData.trend && (
                        <span className="trend-icon">
                          {getTrendIcon(yearData.trend)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="song-content-mobile">
              <div className="song-cover-mobile">
                <img src={songData.image} alt={songData.name} />
              </div>

              <div className="song-info-mobile">
                <h1 className="song-title">{songData.name}</h1>
                <p className="song-meta">
                  {songData.artist} - {songData.year}
                </p>
                <span className="song-weeks-badge">
                  {songData.years[0].weeks}
                </span>
              </div>

              <div className="year-list-mobile">
                {songData.years.map((yearData, index) => (
                  <div key={index} className="year-row-mobile">
                    <span className="year-label">{yearData.year}</span>
                    <span className="year-weeks">{yearData.weeks}</span>
                    <div
                      className={`year-position ${getTrendClass(
                        yearData.trend
                      )}`}
                    >
                      <span className="position-number">
                        {yearData.position}
                      </span>
                      {yearData.trend && (
                        <span className="trend-icon">
                          {getTrendIcon(yearData.trend)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="youtube-btn-mobile">
                <span className="youtube-icon">▶</span> Youtube
              </button>
              <iframe
                src={songData.spotifyUrl}
                width="300"
                height="380"
                frameBorder="0"
                allowTransparency="true"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
              ></iframe>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Song;
