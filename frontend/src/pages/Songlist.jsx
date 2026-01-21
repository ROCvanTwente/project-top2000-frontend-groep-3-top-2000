import React, { useState, useEffect } from "react";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";

const Songlist = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");

  // Available years for the dropdown (Top 2000 started in 1999)
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
    "1999",
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
          `https://top2000api.runasp.net/api/Top2000/by-year/${selectedYear}`,
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
          imagePath: "", // You can add image paths later or use a placeholder
        }));

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

  if (loading)
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-lg">
              Loading Top 2000 for {selectedYear}...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  if (error)
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
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
              http://top2000api.runasp.net/api/Top2000/by-year/{selectedYear}
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
    );

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
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

        <div className="w-full max-w-4xl space-y-2">
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Optional: Header row for the list */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-gray-500 text-sm font-medium">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-1"></div> {/* For image */}
                <div className="col-span-6">Song Title</div>
                <div className="col-span-4">Artist</div>
              </div>

              {songs.map((song) => (
                <ListTile
                  key={`${song.songId}-${selectedYear}`}
                  position={song.position}
                  imagePath={song.imagePath}
                  songName={song.songName}
                  artistName={song.artistName}
                  // trend={song.trend}
                />
              ))}
            </div>
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
  );
};

export default Songlist;
