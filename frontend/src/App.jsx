import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Song from "./pages/song.jsx";
import Artist from "./pages/artist.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Song" element={<Song />} />
      <Route path="/Artist" element={<Artist />} />
    </Routes>
  );
}
