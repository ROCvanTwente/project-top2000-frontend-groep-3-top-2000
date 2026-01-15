import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import Song from "./pages/song.jsx";
import Login from "./pages/login.jsx";
import Account from "./pages/account.jsx";
import Register from "./pages/register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Song" element={<Song />} />
      <Route path="/Songlist" element={<SongList />} />
      <Route path="/Accountinfo" element={<Accountinfo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}
