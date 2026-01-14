import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import Song from "./pages/song.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Song" element={<Song />} />
    </Routes>
  );
}
