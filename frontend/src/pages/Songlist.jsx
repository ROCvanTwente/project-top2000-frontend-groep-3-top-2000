import React, { useState, useEffect } from "react";
import { ListTile } from "../components/listTile";
import ApiService from "../services/api-service";
import { Footer } from "../components/footer";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { Link } from "react-router-dom";

const Songlist = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await ApiService.getTop2000();
        setSongs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading)
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100">
        <NavBar onMenuToggle={handleMenuToggle} />
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
          <div>Loading...</div>
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
          <div>Error: {error}</div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <main className="flex flex-1 flex-col items-center p-4">
        <h1 className="text-3xl font-bold mb-6 pb-4 text-gray-800">Top 2000</h1>
        <div className="w-full max-w-4xl space-y-2">
          {songs.map((song, index) => (
            <ListTile
              key={index}
              position={song.position}
              imagePath={song.imagePath}
              songName={song.songName}
              artistName={song.artistName}
              trend={song.trend}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Songlist;
