const bcrypt = require("bcrypt");
const User = require("./models/User");

const Place = require("./models/Place");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:");
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("TravelBharat backend is running!");
});

// This route sends back ALL places from the database
app.get("/api/places", async (req, res) => {
    try {
      const places = await Place.find({});
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  });


  // CREATE a new place
app.post("/api/places", async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// UPDATE an existing place (found by its unique database ID)
app.put("/api/places/:id", async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// DELETE a place (found by its unique database ID)
app.delete("/api/places/:id", async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// This route handles creating a new account
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check 1: did they actually fill in all three fields?
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Check 2: does this email already have an account?
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Scramble the password before saving it - this is the important part
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user, using the SCRAMBLED password, never the real one
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Account created successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
});


// This route handles signing in
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Step 1: Find the user by their email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Step 2: Compare the typed password against the SCRAMBLED one we saved
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // If we reach here, the email and password are both correct
    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
});


// Toggles a favorite: if the place is already saved, remove it.
// If it's not saved yet, add it. One button, one route, does both.
app.post("/api/users/:userId/favorites/:placeId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const placeId = req.params.placeId;
    const alreadySaved = user.favorites.includes(placeId);

    if (alreadySaved) {
      // Remove it - keep every ID in the list EXCEPT this one
      user.favorites = user.favorites.filter(function (id) {
        return id !== placeId;
      });
    } else {
      // Add it
      user.favorites.push(placeId);
    }

    await user.save();
    res.json({ favorites: user.favorites, saved: !alreadySaved });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// Gets the list of place IDs a user has favorited
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

// Gets the FULL place details for everything a user has favorited
// (not just the IDs - the actual name, city, category, etc.)
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

app.listen(5050, () => {
  console.log("Server running at http://localhost:5050");
});