import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import Song from "./pages/song.jsx";
import SongList from "./pages/Songlist.jsx";
import Accountinfo from "./pages/accountinfo.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Song" element={<Song />} />
      <Route path="/Songlist" element={<SongList />} />
      <Route path="/Accountinfo" element={<Accountinfo />} />
    </Routes>
  );
}
