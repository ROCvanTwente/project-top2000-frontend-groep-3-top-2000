import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { BASE_API_URL } from "../data/api-url";
import { AnimatedBackground } from "../components/AnimatedBackground";

const Songlist = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024"); // the PO finds this good  

  // You can customize this list based on what years are actually available
  const availableYears = [
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000",
  ];

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    // When year changes, reset loading to show loading state
    setLoading(true);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Reset error state on new fetch
        setError(null);

        const response = await fetch(
          `${BASE_API_URL}/api/Top2000/by-year/${selectedYear}`,
        );

        if (!response.ok) {
          // Try to get error message from response
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (e) {
            // If response is not JSON, use default message
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Map the API response to your component's expected format
        const mappedSongs = data.map((song) => ({
          position: song.position,
          songId: song.songId,
          songName: song.titel,
          artistName: song.artist,
          // Choose image the same way as homepage / song detail:
          // prefer artistImage, then songImage/thumbnail/image.
          imagePath:
            song.artistImage ||
            song.songImage ||
            song.thumbnail ||
            song.image ||
            null,
          trend: song.trend,
        }));
        console.log("Fetched songs for year", selectedYear, ":", data);

        setSongs(mappedSongs);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [selectedYear]); // Re-fetch when selectedYear changes

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <AnimatedBackground>
      <div className="w-full min-h-screen flex flex-col">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex flex-1 flex-col items-center p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Top 2000 {selectedYear}
          </h1>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="year-select"
                className="text-gray-700 font-medium whitespace-nowrap"
              >
                Select Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
                disabled={loading}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <span className="skeleton-box" style={{ width: "60px", height: "16px", display: "inline-block", borderRadius: "4px" }}></span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="block mb-2">
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <span
                  className="skeleton-box"
                  style={{
                    position: 'absolute',
                    left: '-24px',
                    top: '-20px',
                    minWidth: '34px',
                    height: '34px',
                    borderRadius: '999px',
                    zIndex: 10,
                  }}
                ></span>
                <div
                  style={{
                    borderRadius: '14px',
                    background: 'transparent',
                    boxShadow: '4px 8px 2px rgba(0,0,0,0.45)',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: '80px',
                  }}
                >
                  <div
                    className="skeleton-box"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      flexShrink: 0,
                    }}
                  ></div>
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <div
                      className="skeleton-box"
                      style={{
                        width: '60%',
                        height: '20px',
                        borderRadius: '4px',
                        marginBottom: '8px',
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{
                        width: '40%',
                        height: '16px',
                        borderRadius: '4px',
                      }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div
                      className="skeleton-box"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{
                        width: '50px',
                        height: '28px',
                        borderRadius: '12px',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <style>{`
        .skeleton-box {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s ease-in-out infinite;
        }
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
    </AnimatedBackground>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <AnimatedBackground>
        <div className="w-full min-h-screen flex flex-col">
          <NavBar onMenuToggle={handleMenuToggle} />
          <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
          <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 font-bold text-lg mb-2">
              Error Loading Songs
            </div>
            <div className="text-gray-700 mb-4">{error}</div>
            <p className="text-sm text-gray-600 mb-4">
              Failed to fetch from:
              `${BASE_API_URL}/api/Top2000/by-year/{selectedYear}`
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setSelectedYear("2024");
                  setLoading(true);
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to 2024
              </button>
            </div>
          </div>
          </main>
          <Footer />
        </div>
      </AnimatedBackground>
    );

  return (
    <AnimatedBackground>
      <div className="w-full min-h-screen flex flex-col">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex flex-1 flex-col items-center p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Top 2000 {selectedYear}
          </h1>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="year-select"
                className="text-gray-700 font-medium whitespace-nowrap"
              >
                Select Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
                disabled={loading}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Display the count of songs */}
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {songs.length} songs
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl">
          {songs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-gray-500 text-lg mb-2">
                No songs found for {selectedYear}
              </div>
              <p className="text-gray-400 text-sm">
                Try selecting a different year from the dropdown
              </p>
            </div>
          ) : (
            <>
              {songs.map((song) => (
                <Link
                  key={`${song.songId}-${selectedYear}`}
                  to={`/song/${song.songId}`}
                  className="block mb-2"
                >
                  <ListTile
                    position={song.position}
                    imagePath={song.imagePath}
                    songName={song.songName}
                    artistName={song.artistName}
                    trend={song.trend}
                  />
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Optional: Year navigation at the bottom */}
        <div className="w-full max-w-4xl mt-8 flex justify-between">
          <button
            onClick={() => {
              const currentIndex = availableYears.indexOf(selectedYear);
              if (currentIndex < availableYears.length - 1) {
                setSelectedYear(availableYears[currentIndex + 1]);
                setLoading(true);
              }
            }}
            disabled={
              availableYears.indexOf(selectedYear) >= availableYears.length - 1
            }
            className="px-4 py-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Older (
            {availableYears[availableYears.indexOf(selectedYear) + 1] || ""})
          </button>

          <button
            onClick={() => {
              const currentIndex = availableYears.indexOf(selectedYear);
              if (currentIndex > 0) {
                setSelectedYear(availableYears[currentIndex - 1]);
                setLoading(true);
              }
            }}
            disabled={availableYears.indexOf(selectedYear) <= 0}
            className="px-4 py-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Newer (
            {availableYears[availableYears.indexOf(selectedYear) - 1] || ""}) →
          </button>
        </div>
        </main>
        <Footer />
      </div>
    </AnimatedBackground>
  );
};

export default Songlist;
