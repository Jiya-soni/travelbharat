require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const Place = require("./models/Place");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Database connection ----------
// Reads the connection string defensively: accepts MONGO_URI or MONGODB_URI,
// and removes stray spaces, quotes, or a pasted "MONGO_URI=" prefix.
const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI || "";
const MONGO_URI = rawUri
  .trim()
  .replace(/^(MONGO_URI|MONGODB_URI)\s*=\s*/i, "")
  .replace(/^["']+|["']+$/g, "")
  .trim();

let lastDbError = "";

if (!MONGO_URI) {
  lastDbError = "MONGO_URI is missing or empty on this server";
  console.log(lastDbError);
} else {
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 20000 })
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((error) => {
      lastDbError = error.message;
      console.log("Failed to connect to MongoDB:", error.message);
    });
}

// ---------- Simple status routes ----------
app.get("/", (req, res) => {
  res.send("TravelBharat API is running");
});

// Shows why the database is or isn't connected. Never shows the password.
app.get("/api/health", (req, res) => {
  const at = MONGO_URI.lastIndexOf("@");
  const uriHost =
    at >= 0
      ? MONGO_URI.slice(at + 1).split("/")[0].split("?")[0]
      : "(no @ found in connection string)";

  res.json({
    dbState: mongoose.connection.readyState, // 1 = connected, 0 = not connected
    envNamesFound: {
      MONGO_URI: !!process.env.MONGO_URI,
      MONGODB_URI: !!process.env.MONGODB_URI,
    },
    uriStartsWith: MONGO_URI.slice(0, 14),
    uriLength: MONGO_URI.length,
    uriHost: uriHost,
    lastError: lastDbError,
  });
});

// ---------- Places ----------
app.get("/api/places", async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

app.post("/api/places", async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

app.put("/api/places/:id", async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

app.delete("/api/places/:id", async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// ---------- Register / Login ----------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
});

// ---------- Favorites ----------
app.post("/api/users/:userId/favorites/:placeId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const placeId = req.params.placeId;
    const alreadySaved = user.favorites.includes(placeId);

    if (alreadySaved) {
      user.favorites = user.favorites.filter(function (id) {
        return id !== placeId;
      });
    } else {
      user.favorites.push(placeId);
    }

    await user.save();
    res.json({ favorites: user.favorites, saved: !alreadySaved });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

app.get("/api/users/:userId/favorites", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

app.get("/api/users/:userId/favorites/full", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favoritePlaces = await Place.find({ _id: { $in: user.favorites } });
    res.json(favoritePlaces);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// ---------- Start ----------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});