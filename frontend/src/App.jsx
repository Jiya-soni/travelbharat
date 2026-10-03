import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import StatePlaces from "./pages/StatePlaces";
import PlaceDetail from "./pages/PlaceDetail";
import Admin from "./pages/Admin";
import Favorites from "./pages/Favorites";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:stateName" element={<StatePlaces />} />
        <Route path="/explore/:stateName/:placeName" element={<PlaceDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;