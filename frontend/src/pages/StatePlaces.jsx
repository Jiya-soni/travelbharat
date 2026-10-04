import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Explore.css";
import "./StatePlaces.css";

function categoryIcon(category) {
  if (category === "Heritage") return "🏛️";
  if (category === "Nature") return "🌿";
  if (category === "Religious") return "🛕";
  if (category === "Adventure") return "⛰️";
  return "📍";
}

function categoryColors(category) {
  if (category === "Heritage") return { accent: "#A87C3C", soft: "#F3E6D3" };
  if (category === "Nature") return { accent: "#2E7D5B", soft: "#DEEFE5" };
  if (category === "Religious") return { accent: "#6B4C8E", soft: "#E9E0F2" };
  if (category === "Adventure") return { accent: "#B5533C", soft: "#F3DFD8" };
  return { accent: "#4A7A8C", soft: "#DEEAEE" };
}

function StatePlaces() {
  const { stateName } = useParams();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    setLoggedInUser(user);

    fetch("https://travelbharat-1irh.onrender.com/api/places")
      .then((res) => res.json())
      .then((allPlaces) => {
        const placesInThisState = allPlaces.filter(
          (place) => place.state.toLowerCase().trim() === stateName.toLowerCase().trim()
        );
        console.log("PLACES DATA:", placesInThisState);
        setPlaces(placesInThisState);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching places:", error);
        setLoading(false);
      });
  }, [stateName]);

  function signOut() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  return (
    <div>
      <div className="page-header">
        <div className="logo">Travel<span>Bharat</span></div>
        <div className="header-actions">
          <a href="/favorites" className="admin-link-btn" style={{ background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}>
            ♥ My Favorites
          </a>
          {loggedInUser?.isAdmin && (
            <a href="/admin" className="admin-link-btn">Admin Panel</a>
          )}
          {loggedInUser && (
            <span className="header-subtitle">Hi, {loggedInUser.name}</span>
          )}
          <button onClick={signOut} className="signout-btn">Sign Out</button>
        </div>
      </div>

      <div className="content">
        <button className="back-button" onClick={() => navigate("/explore")}>
          ← Back to states
        </button>
        <h1>{stateName}</h1>
        <p className="subtitle">Tourist places in {stateName}</p>

        {loading ? (
          <p className="subtitle">Loading places...</p>
        ) : (
          <div className="place-list">
            {places.map((place, index) => {
              const colors = categoryColors(place.category);
              return (
                <button
                  key={place._id}
                  className="place-card"
                  style={{
                    "--place-accent": colors.accent,
                    "--place-accent-soft": colors.soft,
                    animationDelay: `${index * 0.04}s`,
                  }}
                  onClick={() => navigate(`/explore/${encodeURIComponent(stateName)}/${encodeURIComponent(place.name)}`)}
                >
                  <div className="place-card-icon-circle">{categoryIcon(place.category)}</div>
                  <div className="place-card-main">
                    <div className="place-card-top-row">
                      <span className="place-name">{place.name}</span>
                      <span className="place-card-badge">{place.category}</span>
                    </div>
                    <div className="place-info">{place.city}</div>
                  </div>
                  <div className="place-card-chevron">›</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatePlaces;