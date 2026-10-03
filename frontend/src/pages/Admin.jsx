import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Loading places...");

  // Add New Place form fields
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Heritage");
  const [description, setDescription] = useState("");
  const [timings, setTimings] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [famousFood, setFamousFood] = useState("");
  const [nearby, setNearby] = useState("");
  const [transport, setTransport] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  // Edit modal state - a separate set of fields, so editing one place
  // never touches what's typed in the Add New Place form above
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editState, setEditState] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCategory, setEditCategory] = useState("Heritage");
  const [editDescription, setEditDescription] = useState("");
  const [editTimings, setEditTimings] = useState("");
  const [editEntryFee, setEditEntryFee] = useState("");
  const [editBestTime, setEditBestTime] = useState("");
  const [editFamousFood, setEditFamousFood] = useState("");
  const [editNearby, setEditNearby] = useState("");
  const [editTransport, setEditTransport] = useState("");
  const [editImage1, setEditImage1] = useState("");
  const [editImage2, setEditImage2] = useState("");
  const [editImage3, setEditImage3] = useState("");
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!user || !user.isAdmin) {
      alert("You don't have permission to view this page.");
      navigate("/login");
      return;
    }
    loadAllPlaces();
  }, []);

  async function loadAllPlaces() {
    try {
      const response = await fetch("http://localhost:5050/api/places");
      const data = await response.json();
      setPlaces(data);
      setStatusMessage(data.length + " places total");
    } catch (error) {
      setStatusMessage("Couldn't load places. Is the server running?");
      console.log("Error:", error);
    }
  }

  function signOut() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  async function deletePlace(id, placeName) {
    const confirmed = confirm(`Delete "${placeName}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost:5050/api/places/" + id, {
        method: "DELETE",
      });
      if (response.ok) {
        loadAllPlaces();
      } else {
        alert("Something went wrong deleting this place.");
      }
    } catch (error) {
      alert("Couldn't connect to the server.");
    }
  }

  function openEditModal(place) {
    setEditId(place._id);
    setEditName(place.name || "");
    setEditState(place.state || "");
    setEditCity(place.city || "");
    setEditCategory(place.category || "Heritage");
    setEditDescription(place.description || "");
    setEditTimings(place.timings || "");
    setEditEntryFee(place.entryFee || "");
    setEditBestTime(place.bestTime || "");
    setEditFamousFood(place.famousFood || "");
    setEditNearby(place.nearby || "");
    setEditTransport(place.transport || "");
    const images = place.images || [];
    setEditImage1(images[0] || "");
    setEditImage2(images[1] || "");
    setEditImage3(images[2] || "");
    setEditMessage("");
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
  }

  async function saveEdit() {
    const images = [editImage1, editImage2, editImage3].filter((url) => url.trim() !== "");
    const updatedData = {
      name: editName, state: editState, city: editCity, category: editCategory,
      description: editDescription, timings: editTimings, entryFee: editEntryFee,
      bestTime: editBestTime, famousFood: editFamousFood, nearby: editNearby,
      transport: editTransport, image: images.length > 0 ? images[0] : "", images,
    };

    try {
      const response = await fetch("http://localhost:5050/api/places/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        closeEditModal();
        loadAllPlaces();
      } else {
        setEditMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setEditMessage("Couldn't connect to the server.");
    }
  }

  function clearForm() {
    setName(""); setState(""); setCity(""); setDescription("");
    setTimings(""); setEntryFee(""); setBestTime(""); setFamousFood("");
    setNearby(""); setTransport(""); setImage1(""); setImage2(""); setImage3("");
  }

  async function createPlace() {
    if (!name || !state || !city) {
      setFormMessage("Please fill in at least Name, State, and City.");
      setFormMessageType("bad");
      return;
    }

    const images = [image1, image2, image3].filter((url) => url.trim() !== "");
    const image = images.length > 0 ? images[0] : "";

    try {
      const response = await fetch("http://localhost:5050/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, state, city, category, description,
          timings, entryFee, bestTime, famousFood, nearby, transport,
          image, images,
        }),
      });

      if (response.ok) {
        setFormMessage("Place added successfully!");
        setFormMessageType("good");
        clearForm();
        loadAllPlaces();
      } else {
        setFormMessage("Something went wrong. Please try again.");
        setFormMessageType("bad");
      }
    } catch (error) {
      setFormMessage("Couldn't connect to the server.");
      setFormMessageType("bad");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="logo">Travel<span>Bharat</span> <span style={{ fontSize: "13px", opacity: 0.7 }}>Admin</span></div>
        <div className="header-actions">
          <a href="/explore" className="back-link">← Back to Site</a>
          <button onClick={signOut} className="signout-btn">Sign Out</button>
        </div>
      </div>

      <div className="content">
        <h1>All Places</h1>
        <p className="subtitle" style={{ color: "var(--color-text-light)", fontSize: "14px", marginBottom: "24px" }}>
          {statusMessage}
        </p>

        <div className="add-form-box">
          <h2>Add New Place</h2>

          <div className="form-grid">
            <div>
              <label className="field-label">Place Name</label>
              <input type="text" placeholder="e.g. Mehrangarh Fort" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="field-label">State</label>
              <input type="text" placeholder="e.g. Rajasthan" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">City</label>
              <input type="text" placeholder="e.g. Jodhpur" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Religious">Religious</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>
          </div>

          <div className="form-grid full-width">
            <div>
              <label className="field-label">Description</label>
              <textarea rows="2" placeholder="A short description..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">Timings</label>
              <input type="text" placeholder="e.g. 9:00 AM - 5:00 PM" value={timings} onChange={(e) => setTimings(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Entry Fee</label>
              <input type="text" placeholder="e.g. Free, or ₹50" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">Best Time to Visit</label>
              <input type="text" placeholder="e.g. October to March" value={bestTime} onChange={(e) => setBestTime(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Famous Food</label>
              <input type="text" placeholder="e.g. Local sweets, thali" value={famousFood} onChange={(e) => setFamousFood(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">Nearby Attractions</label>
              <input type="text" placeholder="e.g. Fort, Lake, Market" value={nearby} onChange={(e) => setNearby(e.target.value)} />
            </div>
            <div>
              <label className="field-label">How to Reach</label>
              <input type="text" placeholder="e.g. Nearest airport..." value={transport} onChange={(e) => setTransport(e.target.value)} />
            </div>
          </div>

          <div className="form-grid full-width">
            <div>
              <label className="field-label">Photo URL 1 (optional - main photo)</label>
              <input type="text" placeholder="https://images.unsplash.com/..." value={image1} onChange={(e) => setImage1(e.target.value)} />
            </div>
          </div>
          <div className="form-grid full-width">
            <div>
              <label className="field-label">Photo URL 2 (optional)</label>
              <input type="text" placeholder="https://images.unsplash.com/..." value={image2} onChange={(e) => setImage2(e.target.value)} />
            </div>
          </div>
          <div className="form-grid full-width">
            <div>
              <label className="field-label">Photo URL 3 (optional)</label>
              <input type="text" placeholder="https://images.unsplash.com/..." value={image3} onChange={(e) => setImage3(e.target.value)} />
            </div>
          </div>

          <button className="save-button" onClick={createPlace}>Add Place</button>
          {formMessage && <p className={"form-message " + formMessageType}>{formMessage}</p>}
        </div>

        <div className="table-scroll-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>City</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place._id}>
                  <td>{place.name}</td>
                  <td>{place.state}</td>
                  <td>{place.city}</td>
                  <td>{place.category}</td>
                  <td>
                    <button className="edit-button" onClick={() => openEditModal(place)}>Edit</button>
                    <button className="delete-button" onClick={() => deletePlace(place._id, place.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={isEditOpen ? "modal-overlay open" : "modal-overlay"}>
        <div className="modal-box">
          <h2>Edit Place</h2>

          <div className="form-grid">
            <div>
              <label className="field-label">Place Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="field-label">State</label>
              <input type="text" value={editState} onChange={(e) => setEditState(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">City</label>
              <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Category</label>
              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Religious">Religious</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>
          </div>

          <div className="form-grid full-width">
            <div>
              <label className="field-label">Description</label>
              <textarea rows="2" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">Timings</label>
              <input type="text" value={editTimings} onChange={(e) => setEditTimings(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Entry Fee</label>
              <input type="text" value={editEntryFee} onChange={(e) => setEditEntryFee(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">Best Time to Visit</label>
              <input type="text" value={editBestTime} onChange={(e) => setEditBestTime(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Famous Food</label>
              <input type="text" value={editFamousFood} onChange={(e) => setEditFamousFood(e.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label className="field-label">Nearby Attractions</label>
              <input type="text" value={editNearby} onChange={(e) => setEditNearby(e.target.value)} />
            </div>
            <div>
              <label className="field-label">How to Reach</label>
              <input type="text" value={editTransport} onChange={(e) => setEditTransport(e.target.value)} />
            </div>
          </div>

          <div className="form-grid full-width">
            <div>
              <label className="field-label">Photo URL 1</label>
              <input type="text" value={editImage1} onChange={(e) => setEditImage1(e.target.value)} />
            </div>
          </div>
          <div className="form-grid full-width">
            <div>
              <label className="field-label">Photo URL 2</label>
              <input type="text" value={editImage2} onChange={(e) => setEditImage2(e.target.value)} />
            </div>
          </div>
          <div className="form-grid full-width">
            <div>
              <label className="field-label">Photo URL 3</label>
              <input type="text" value={editImage3} onChange={(e) => setEditImage3(e.target.value)} />
            </div>
          </div>

          <div className="modal-actions">
            <button className="save-button" onClick={saveEdit}>Save Changes</button>
            <button className="cancel-button" onClick={closeEditModal}>Cancel</button>
          </div>
          {editMessage && <p className="form-message bad">{editMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Admin;