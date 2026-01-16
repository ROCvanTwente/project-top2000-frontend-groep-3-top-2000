import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import Song from "./pages/song.jsx";
import Artist from "./pages/artist.jsx";
import Login from "./pages/login.jsx";
import Account from "./pages/account.jsx";
import Register from "./pages/register.jsx";
import Songlist from "./pages/Songlist.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/song" element={<Song />} />
      <Route path="/artist" element={<Artist />} />
      <Route path="/songlist" element={<Songlist />} />
      <Route path="/accountinfo" element={<Account />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
      <Route path="/faq" element={<FAQ />} />
    </Routes>
  );
}
