import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

const stateList = [
  { name: "Punjab", color: "#4C6B8E", region: "North", image: "https://images.unsplash.com/photo-1757552528834-09a6e8c7c9ed?w=800&q=80&auto=format&fit=crop" },
  { name: "Haryana", color: "#6C7A89", region: "North", image: "https://plus.unsplash.com/premium_photo-1697730464803-fcede713753e?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Himachal Pradesh", color: "#3B6E91", region: "North", image: "https://images.unsplash.com/photo-1655470062377-ef3f5161960a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Rajasthan", color: "#B5533C", region: "North", image: "https://plus.unsplash.com/premium_photo-1697730421382-bc8dd92f83ba?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Uttar Pradesh", color: "#A87C3C", region: "Central", image: "https://images.unsplash.com/photo-1658313286353-81f8cf3a328a?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Uttarakhand", color: "#4C8E6B", region: "Central", image: "https://images.unsplash.com/photo-1718528565878-7fd7c72f5196?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Madhya Pradesh", color: "#A85C4C", region: "Central", image: "https://plus.unsplash.com/premium_photo-1661963839850-b4be117aff11?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Chhattisgarh", color: "#5E7C6A", region: "Central", image: "https://images.unsplash.com/photo-1673462107499-97848ff888b9?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Bihar", color: "#8E5B3F", region: "East", image: "https://images.unsplash.com/photo-1725951602381-3e759a5ce430?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Jharkhand", color: "#9C6B4A", region: "East", image: "https://images.unsplash.com/photo-1596103399853-6b41f3fad275?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Odisha", color: "#C17A3C", region: "East", image: "https://images.unsplash.com/photo-1723871568897-d0680195f20a?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "West Bengal", color: "#6B4C4C", region: "East", image: "https://images.unsplash.com/photo-1724650965526-4ab37c60a3f9?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Goa", color: "#D98E4A", region: "West", image: "https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Gujarat", color: "#7C6A8E", region: "West", image: "https://images.unsplash.com/photo-1620103143245-9efb3e4a7553?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Maharashtra", color: "#B5533C", region: "West", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Andhra Pradesh", color: "#C1666B", region: "South", image: "https://images.unsplash.com/photo-1707833711203-7b37bdeb73b6?q=80&w=2231&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Karnataka", color: "#4A7A8C", region: "South", image: "https://plus.unsplash.com/premium_photo-1697730337612-8bd916249e30?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Kerala", color: "#2E7D5B", region: "South", image: "https://images.unsplash.com/photo-1677475455506-1e429162f44f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Tamil Nadu", color: "#8E4C4C", region: "South", image: "https://images.unsplash.com/photo-1625807161536-27903f2200fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Telangana", color: "#4C6B4C", region: "South", image: "https://images.unsplash.com/photo-1560237606-f82b6cb1ebbf?q=80&w=2178&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Assam", color: "#7A6C4C", region: "Northeast", image: "https://images.unsplash.com/photo-1615472910606-9d4f7291944f?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Arunachal Pradesh", color: "#4C7A5D", region: "Northeast", image: "https://images.unsplash.com/photo-1566728059008-079a722420d7?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Manipur", color: "#6B8E4C", region: "Northeast", image: "https://plus.unsplash.com/premium_photo-1713375115181-edb9c7e7b379?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Meghalaya", color: "#4C8E7A", region: "Northeast", image: "https://images.unsplash.com/photo-1742494267580-e026d3737f65?q=80&w=1676&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Mizoram", color: "#8E6B7A", region: "Northeast", image: "https://images.unsplash.com/photo-1652792595182-427510e8644f?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Nagaland", color: "#7A4C6B", region: "Northeast", image: "https://images.unsplash.com/photo-1700042629181-e6b100894f6f?q=80&w=2038&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Sikkim", color: "#6B4C8E", region: "Northeast", image: "https://images.unsplash.com/photo-1573398643956-2b9e6ade3456?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "Tripura", color: "#7A8E4C", region: "Northeast", image: "https://images.unsplash.com/photo-1695150854909-a00039a284b8?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.1.0" },
];

const regions = ["All", "North", "South", "East", "West", "Central", "Northeast"];

function categoryIconSmall(category) {
  if (category === "Heritage") return "🏛️";
  if (category === "Nature") return "🌿";
  if (category === "Religious") return "🛕";
  if (category === "Adventure") return "⛰️";
  return "📍";
}

function Explore() {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [stateData, setStateData] = useState({});
  const [allPlaces, setAllPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRegion, setCurrentRegion] = useState("All");
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    setLoggedInUser(user);

    fetch("http://localhost:5050/api/places")
      .then((res) => res.json())
      .then((places) => {
        setAllPlaces(places);

        const grouped = {};
        places.forEach((place) => {
          if (!grouped[place.state]) {
            grouped[place.state] = [];
          }
          grouped[place.state].push(place);
        });
        setStateData(grouped);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching places:", error);
        setLoading(false);
      });
  }, []);

  function signOut() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  const filteredStates = stateList.filter((state) => {
    const matchesRegion = currentRegion === "All" || state.region === currentRegion;
    const matchesSearch = state.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Matches individual PLACE names too, not just states - this is what lets
  // someone search "Taj Mahal" and jump straight to it
  const matchingPlaces =
    currentSearch.trim().length > 0
      ? allPlaces
          .filter((place) => place.name.toLowerCase().includes(currentSearch.toLowerCase().trim()))
          .slice(0, 6)
      : [];

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
        <h1>Choose a State</h1>

        {loading ? (
          <p className="subtitle">Loading destinations...</p>
        ) : (
          <>
            <div className="search-wrap" style={{ position: "relative" }}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for a state or a place..."
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
              />

              {matchingPlaces.length > 0 && (
                <div className="search-results-dropdown">
                  {matchingPlaces.map((place) => (
                    <button
                      key={place._id}
                      className="search-result-item"
                      onClick={() => {
                        setCurrentSearch("");
                        navigate(`/explore/${encodeURIComponent(place.state)}/${encodeURIComponent(place.name)}`);
                      }}
                    >
                      <span className="search-result-icon">{categoryIconSmall(place.category)}</span>
                      <span className="search-result-text">
                        <span className="search-result-name">{place.name}</span>
                        <div className="search-result-location">{place.city}, {place.state}</div>
                      </span>
                      <span className="search-result-category">{place.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="region-tabs">
              {regions.map((region) => (
                <button
                  key={region}
                  className={region === currentRegion ? "region-tab active" : "region-tab"}
                  onClick={() => setCurrentRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="state-grid">
              {filteredStates.length === 0 ? (
                <div className="no-results">No states match "{currentSearch}"</div>
              ) : (
                filteredStates.map((state, index) => {
                  const placesInState = stateData[state.name] || [];
                  const bandStyle = state.image
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.6)), url('${state.image}')`,
                      }
                    : {
                        background: `linear-gradient(135deg, ${state.color}, var(--color-indigo-deep))`,
                      };

                  return (
                    <button
                      key={state.name}
                      className="state-card"
                      style={{ animationDelay: `${index * 0.03}s` }}
                      onClick={() => navigate(`/explore/${encodeURIComponent(state.name)}`)}
                    >
                      <div className="state-card-band" style={bandStyle}>
                        <div className="state-name">{state.name}</div>
                      </div>
                      <div className="state-card-body">
                        <div className="state-card-count">{placesInState.length} places</div>
                        <div className="state-card-arrow">Explore →</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Explore;