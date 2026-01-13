import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Song from "./pages/Song";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Song.jsx" element={<Song />} />
    </Routes>
  );
}
