import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Explore.css";
import "./PlaceDetail.css";

const stateColors = {
  "Punjab": "#4C6B8E", "Haryana": "#6C7A89", "Himachal Pradesh": "#3B6E91", "Rajasthan": "#B5533C",
  "Uttar Pradesh": "#A87C3C", "Uttarakhand": "#4C8E6B", "Madhya Pradesh": "#A85C4C", "Chhattisgarh": "#5E7C6A",
  "Bihar": "#8E5B3F", "Jharkhand": "#9C6B4A", "Odisha": "#C17A3C", "West Bengal": "#6B4C4C",
  "Goa": "#D98E4A", "Gujarat": "#7C6A8E", "Maharashtra": "#B5533C",
  "Andhra Pradesh": "#C1666B", "Karnataka": "#4A7A8C", "Kerala": "#2E7D5B", "Tamil Nadu": "#8E4C4C", "Telangana": "#4C6B4C",
  "Assam": "#7A6C4C", "Arunachal Pradesh": "#4C7A5D", "Manipur": "#6B8E4C", "Meghalaya": "#4C8E7A",
  "Mizoram": "#8E6B7A", "Nagaland": "#7A4C6B", "Sikkim": "#6B4C8E", "Tripura": "#7A8E4C",
};

function categoryIcon(category) {
  if (category === "Heritage") return "🏛️";
  if (category === "Nature") return "🌿";
  if (category === "Religious") return "🛕";
  if (category === "Adventure") return "⛰️";
  return "📍";
}

function PlaceDetail() {
  const { stateName, placeName } = useParams();
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    setLoggedInUser(user);

    fetch("http://localhost:5050/api/places")
      .then((res) => res.json())
      .then((allPlaces) => {
        const found = allPlaces.find(
          (p) =>
            p.state.toLowerCase().trim() === stateName.toLowerCase().trim() &&
            p.name.toLowerCase().trim() === placeName.toLowerCase().trim()
        );
        setPlace(found || null);
        setLoading(false);

        // Check if this place is already in the user's favorites
        if (found) {
          fetch(`http://localhost:5050/api/users/${user.id}/favorites`)
            .then((res) => res.json())
            .then((data) => {
              setIsSaved(data.favorites.includes(found._id));
            })
            .catch(() => {});
        }
      })
      .catch((error) => {
        console.log("Error fetching place:", error);
        setLoading(false);
      });
  }, [stateName, placeName]);

  function signOut() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  async function toggleBookmark() {
    if (!loggedInUser || !place) return;
    try {
      const response = await fetch(
        `http://localhost:5050/api/users/${loggedInUser.id}/favorites/${place._id}`,
        { method: "POST" }
      );
      const data = await response.json();
      setIsSaved(data.saved);
    } catch (error) {
      console.log("Error saving favorite:", error);
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Builds up to 3 gallery tiles, same logic as before:
  // use the images list if present, fall back to single image, then placeholders
  function buildGalleryTiles() {
    let photos = [];
    if (place.images && place.images.length > 0) {
      photos = place.images;
    } else if (place.image) {
      photos = [place.image];
    }

    const tiles = [];
    for (let i = 0; i < 3; i++) {
      if (photos[i]) {
        tiles.push(
          <div
            key={i}
            className="gallery-tile"
            style={{ backgroundImage: `url('${photos[i]}')` }}
          ></div>
        );
      } else if (i === 0) {
        tiles.push(
          <div key={i} className="gallery-tile">
            <span className="g-icon">{categoryIcon(place.category)}</span>
            <span className="g-label">Photo coming soon</span>
          </div>
        );
      } else {
        tiles.push(
          <div key={i} className="gallery-tile">
            <span className="g-icon">📷</span>
            <span className="g-label">More photos coming soon</span>
          </div>
        );
      }
    }
    return tiles;
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="logo">Travel<span>Bharat</span></div>
        </div>
        <div className="content">
          <p className="subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div>
        <div className="page-header">
          <div className="logo">Travel<span>Bharat</span></div>
        </div>
        <div className="content">
          <p className="subtitle">Place not found.</p>
        </div>
      </div>
    );
  }

  const heroColor = stateColors[stateName] || "#1B2A45";

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

      <div className="detail-back-wrap">
        <button className="back-button" onClick={() => navigate(`/explore/${encodeURIComponent(stateName)}`)}>
          ← Back to places
        </button>
      </div>

      <div
        className="detail-hero"
        style={{ background: `linear-gradient(160deg, ${heroColor} 0%, #121D33 130%)` }}
      >
        <button className={isSaved ? "bookmark-btn saved" : "bookmark-btn"} onClick={toggleBookmark}>
          {isSaved ? "♥" : "♡"}
        </button>
        <span className="detail-hero-tag">{place.category}</span>
        <h1>{place.name}</h1>
        <p className="detail-hero-location">{place.city}, {stateName}</p>
      </div>

      <div className="quick-stats">
        <div className="quick-stat-chip">{categoryIcon(place.category)} <b>{place.category}</b></div>
        <div className="quick-stat-chip">📍 {place.city}</div>
        {place.bestTime && <div className="quick-stat-chip">📅 Best: <b>{place.bestTime}</b></div>}
      </div>

      <div className="detail-nav-wrap">
        <div className="detail-nav">
          <a onClick={() => scrollToSection("section-about")}>About</a>
          <a onClick={() => scrollToSection("section-gallery")}>Gallery</a>
          <a onClick={() => scrollToSection("section-more")}>Food &amp; Nearby</a>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-story">
          {place.description ? (
            <>
              <div id="section-about">
                <h2>About</h2>
                <p className="detail-text">{place.description}</p>
              </div>

              <div id="section-gallery">
                <h2 style={{ marginBottom: "14px" }}>Gallery</h2>
                <div className="gallery-strip">{buildGalleryTiles()}</div>
              </div>

              <div id="section-more">
                <div className="detail-subsection">
                  <div className="detail-subsection-label">Famous Food</div>
                  <div className="detail-subsection-text">{place.famousFood}</div>
                </div>
                <div className="detail-subsection">
                  <div className="detail-subsection-label">Nearby Attractions</div>
                  <div className="detail-subsection-text">{place.nearby}</div>
                </div>
              </div>
            </>
          ) : (
            <p className="coming-soon">Full details for this place are coming soon.</p>
          )}
        </div>

        <div className="trip-card">
          <div className="trip-card-title">Trip Details</div>
          {place.description ? (
            <>
              <div className="trip-row">
                <div className="trip-row-icon">{categoryIcon(place.category)}</div>
                <div>
                  <div className="trip-row-label">Best Time to Visit</div>
                  <div className="trip-row-value">{place.bestTime}</div>
                </div>
              </div>
              <div className="trip-row">
                <div className="trip-row-icon">🕒</div>
                <div>
                  <div className="trip-row-label">Timings</div>
                  <div className="trip-row-value">{place.timings}</div>
                </div>
              </div>
              <div className="trip-row">
                <div className="trip-row-icon">🎟️</div>
                <div>
                  <div className="trip-row-label">Entry Fee</div>
                  <div className="trip-row-value">{place.entryFee}</div>
                </div>
              </div>
              <div className="trip-row">
                <div className="trip-row-icon">🚌</div>
                <div>
                  <div className="trip-row-label">How to Reach</div>
                  <div className="trip-row-value">{place.transport}</div>
                </div>
              </div>
            </>
          ) : (
            <p className="coming-soon">Coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceDetail;