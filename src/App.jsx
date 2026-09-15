import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
      <div className="aurora" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <NavBar />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          Ani<span className="gradient-text">Fav</span> · Data from{" "}
          <a href="https://anilist.co" target="_blank" rel="noreferrer">
            AniList
          </a>
        </p>
      </footer>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
