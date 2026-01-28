import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Footer } from "../components/footer";
import "./song.css";

const Song = () => {
  const { id } = useParams(); // Get the song ID from the URL
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearData, setYearData] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  // Function to generate YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    if (songData && songData.youtube) {
      const videoId = getYouTubeVideoId(songData.youtube);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  };

  // Function to generate YouTube search URL
  const getYouTubeUrl = (songName, artistName) => {
    if (songData && songData.youtube) {
      const videoId = getYouTubeVideoId(songData.youtube);
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
      return songData.youtube;
    }

    // Create a search URL with song name and artist
    const searchQuery = encodeURIComponent(
      `${songName} ${artistName} official`,
    );
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  // Fetch song details
  useEffect(() => {
    const fetchSongData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://top2000api.runasp.net/api/Song/${id}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSongData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching song data:", err);
        setError("Failed to load song data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch years data for this song
    const fetchYearData = async () => {
      try {
        setLoadingYears(true);
        const response = await fetch(
          `http://top2000api.runasp.net/api/Song/${id}/years`,
        );

        if (response.ok) {
          const data = await response.json();
          setYearData(data);
        } else {
          // If no specific endpoint for years, use a fallback or empty array
          console.warn("No year data endpoint found, using fallback");
          // You could also fetch from a different endpoint or use fallback data
        }
      } catch (err) {
        console.error("Error fetching year data:", err);
        // Use fallback data if API call fails
        setYearData([
          { year: 2025, weeks: 1, position: 1, trend: null },
          { year: 2024, weeks: 24, position: 12, trend: "up" },
          { year: 2023, weeks: 24, position: 12, trend: "down" },
          { year: 2022, weeks: 24, position: 12, trend: "up" },
        ]);
      } finally {
        setLoadingYears(false);
      }
    };

    if (id) {
      fetchSongData();
      fetchYearData();
    }
  }, [id]); // Re-run when ID changes

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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <main className="flex-1">
        <div className="song-page">
          <div className="song-container">
            {/* Desktop Skeleton */}
            <div className="song-content-desktop">
              <div className="song-left">
                <div className="song-cover">
                  <div
                    className="skeleton-box"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  ></div>
                </div>
                <div className="song-info">
                  <div
                    className="skeleton-box"
                    style={{
                      width: "80%",
                      height: "28px",
                      marginBottom: "12px",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <div
                    className="skeleton-box"
                    style={{
                      width: "60%",
                      height: "20px",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <div
                  className="skeleton-box"
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "6px",
                    marginBottom: "16px",
                  }}
                ></div>
                <div
                  className="skeleton-box"
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "6px",
                    marginBottom: "16px",
                  }}
                ></div>
                <div
                  className="skeleton-box"
                  style={{
                    width: "100%",
                    height: "380px",
                    borderRadius: "8px",
                  }}
                ></div>
              </div>
              <div className="song-right">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="year-row">
                    <div
                      className="skeleton-box"
                      style={{
                        width: "60px",
                        height: "24px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{
                        width: "40px",
                        height: "20px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{
                        width: "80px",
                        height: "32px",
                        borderRadius: "16px",
                        marginLeft: "auto",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="song-content-mobile">
              <div className="song-cover-mobile">
                <div
                  className="skeleton-box"
                  style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                ></div>
              </div>
              <div className="song-info-mobile">
                <div
                  className="skeleton-box"
                  style={{
                    width: "70%",
                    height: "24px",
                    marginBottom: "12px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  className="skeleton-box"
                  style={{ width: "50%", height: "18px", borderRadius: "4px" }}
                ></div>
              </div>
              <div className="year-list-mobile">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="year-row-mobile">
                    <div
                      className="skeleton-box"
                      style={{
                        width: "50px",
                        height: "20px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{
                        width: "30px",
                        height: "18px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{
                        width: "70px",
                        height: "28px",
                        borderRadius: "16px",
                        marginLeft: "auto",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div
                className="skeleton-box"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              ></div>
              <div
                className="skeleton-box"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              ></div>
              <div
                className="skeleton-box"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              ></div>
              <div
                className="skeleton-box"
                style={{ width: "100%", height: "200px", borderRadius: "8px" }}
              ></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );

  // Loading state
  if (loading) {
    return <SkeletonLoader />;
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-red-600">{error}</p>
        </main>
      </div>
    );
  }

  // No data state
  if (!songData) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Song not found.</p>
        </main>
      </div>
    );
  }

  // Use actual data from API
  const currentYear = new Date().getFullYear();
  const displayData = {
    name: songData.titel || "Unknown Song",
    artist: songData.artistName || "Unknown Artist",
    year: songData.releaseYear || currentYear,
    image: songData.imgUrl || "/example.png", // Fallback image
    artistId: songData.artistId || songData.artist_id || null, // Support multiple field name variations
  };

  // Generate YouTube URLs based on available data
  const youtubeUrl = getYouTubeUrl(displayData.name, displayData.artist);
  const youtubeEmbedUrl = getYouTubeEmbedUrl();

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
                  <img
                    src={displayData.image}
                    alt={displayData.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/example.png"; // Fallback if image fails to load
                    }}
                  />
                </div>
                <div className="song-info">
                  <h1 className="song-title">{displayData.name}</h1>
                  <p className="song-meta">
                    {displayData.artist} - {displayData.year}
                  </p>
                </div>
                {displayData.artistId && (
                  <Link
                    to={`/artist/${displayData.artistId}`}
                    className="artist-btn"
                  >
                    <span className="artist-icon">👤</span> View Artist
                  </Link>
                )}
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-btn"
                >
                  <span className="youtube-icon">▶</span> YouTube
                </a>
                {youtubeEmbedUrl && (
                  <div className="youtube-embed-container">
                    <iframe
                      src={youtubeEmbedUrl}
                      width="100%"
                      height="380"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      title="YouTube Video Player"
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Right side - Year statistics */}
              <div className="song-right">
                {loadingYears ? (
                  <p className="text-center py-4">Loading year data...</p>
                ) : yearData.length > 0 ? (
                  yearData.map((yearDataItem, index) => (
                    <div key={index} className="year-row">
                      <span className="year-label">{yearDataItem.year}</span>
                      <span className="year-weeks">{yearDataItem.weeks}</span>
                      <div
                        className={`year-position ${getTrendClass(
                          yearDataItem.trend,
                        )}`}
                      >
                        <span className="position-number">
                          {yearDataItem.position}
                        </span>
                        {yearDataItem.trend && (
                          <span className="trend-icon">
                            {getTrendIcon(yearDataItem.trend)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  //here we need to add the list of songs via the api http://top2000api.runasp.net/api/Top2000/by-song/ {songid}
                  <p className="text-center py-4">
                    No year data available rn sorry
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="song-content-mobile">
              <div className="song-cover-mobile">
                <img
                  src={displayData.image}
                  alt={displayData.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/example.png";
                  }}
                />
              </div>

              <div className="song-info-mobile">
                <h1 className="song-title">{displayData.name}</h1>
                <p className="song-meta">
                  {displayData.artist} - {displayData.year}
                </p>
                {yearData.length > 0 && (
                  <span className="song-weeks-badge">{yearData[0].weeks}</span>
                )}
              </div>

              {displayData.artistId && (
                <Link
                  to={`/artist/${displayData.artistId}`}
                  className="artist-btn-mobile"
                >
                  <span className="artist-icon">👤</span> View Artist
                </Link>
              )}

              <div className="year-list-mobile">
                {loadingYears ? (
                  <p className="text-center py-4">Loading year data...</p>
                ) : yearData.length > 0 ? (
                  yearData.map((yearDataItem, index) => (
                    <div key={index} className="year-row-mobile">
                      <span className="year-label">{yearDataItem.year}</span>
                      <span className="year-weeks">{yearDataItem.weeks}</span>
                      <div
                        className={`year-position ${getTrendClass(
                          yearDataItem.trend,
                        )}`}
                      >
                        <span className="position-number">
                          {yearDataItem.position}
                        </span>
                        {yearDataItem.trend && (
                          <span className="trend-icon">
                            {getTrendIcon(yearDataItem.trend)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No year data available</p>
                )}
              </div>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-btn-mobile"
              >
                <span className="youtube-icon">▶</span> YouTube
              </a>

              {youtubeEmbedUrl && (
                <div className="youtube-embed-container-mobile">
                  <iframe
                    src={youtubeEmbedUrl}
                    width="100%"
                    height="200"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title="YouTube Video Player"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Song;
