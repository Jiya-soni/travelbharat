import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";

function categoryIcon(category) {
  if (category === "Heritage") return "🏛️";
  if (category === "Nature") return "🌿";
  if (category === "Religious") return "🛕";
  if (category === "Adventure") return "⛰️";
  return "📍";
}

function categoryColor(category) {
  if (category === "Heritage") return "#A87C3C";
  if (category === "Nature") return "#2E7D5B";
  if (category === "Religious") return "#6B4C8E";
  if (category === "Adventure") return "#B5533C";
  return "#4A7A8C";
}

function Favorites() {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Loading your saved places...");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    setLoggedInUser(user);
    loadFavorites(user);
  }, []);

  async function loadFavorites(user) {
    try {
      const response = await fetch(`http://localhost:5050/api/users/${user.id}/favorites/full`);
      const data = await response.json();
      setPlaces(data);

      if (data.length === 0) {
        setStatusMessage("");
      } else {
        setStatusMessage(data.length + " saved place" + (data.length === 1 ? "" : "s"));
      }
    } catch (error) {
      setStatusMessage("Couldn't load favorites. Is the server running?");
      console.log("Error:", error);
    }
  }

  async function removeFavorite(placeId) {
    try {
      await fetch(`http://localhost:5050/api/users/${loggedInUser.id}/favorites/${placeId}`, {
        method: "POST",
      });
      loadFavorites(loggedInUser);
    } catch (error) {
      console.log("Error removing favorite:", error);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="logo">Travel<span>Bharat</span></div>
        <a href="/explore" className="back-link">← Back to Explore</a>
      </div>

      <div className="content">
        <h1>My Favorites</h1>
        <p className="subtitle">{statusMessage}</p>

        <div className="fav-grid">
          {places.length === 0 && statusMessage === "" ? (
            <div className="empty-state">
              You haven't saved any places yet.<br />
              <a href="/explore">Start exploring →</a>
            </div>
          ) : (
            places.map((place, index) => {
              const color = categoryColor(place.category);
              return (
                <div
                  key={place._id}
                  className="fav-card"
                  style={{ animationDelay: `${index * 0.03}s` }}
                  onClick={() =>
                    navigate(`/explore/${encodeURIComponent(place.state)}/${encodeURIComponent(place.name)}`)
                  }
                >
                  <div
                    className="fav-card-band"
                    style={{ background: `linear-gradient(135deg, ${color}, #121D33)` }}
                  >
                    <span className="fav-card-badge">{place.category}</span>
                    <button
                      className="remove-heart"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(place._id);
                      }}
                    >
                      ♥
                    </button>
                    <span className="fav-card-icon">{categoryIcon(place.category)}</span>
                  </div>
                  <div className="fav-card-body">
                    <div className="fav-name">{place.name}</div>
                    <div className="fav-info">{place.city}, {place.state}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;