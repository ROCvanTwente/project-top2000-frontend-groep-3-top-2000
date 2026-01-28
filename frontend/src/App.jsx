import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import Song from "./pages/song.jsx";
import Artist from "./pages/artist.jsx";
import Login from "./pages/login.jsx";
import Account from "./pages/account.jsx";
import Register from "./pages/register.jsx";
import Songlist from "./pages/Songlist.jsx";
import FAQ from "./pages/FAQ.jsx";
import Admin from "./pages/admin.jsx";
import Geschiedenis from "./pages/geschiedenis.jsx";
import ArtistList from "./pages/artistList.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Song" element={<Song />} />
      <Route path="/Artist" element={<Artist />} />
      <Route path="/Songlist" element={<Songlist />} />
      <Route path="/Artistlist" element={<ArtistList />} />
      <Route path="/Accountinfo" element={<Account />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
      <Route path="/FAQ" element={<FAQ />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/geschiedenis" element={<Geschiedenis />} />
    </Routes>
  );
}
