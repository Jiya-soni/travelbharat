// This script adds real photo URLs to specific places, by name.
// Same pattern as updatePlaces.js - safe to run again, only updates
// the "image" field on matching places.

const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("./models/Place");

const updates = [
  {
    name: "Taj Mahal",
    image: "https://images.unsplash.com/photo-1769345547761-093f476c6b5f?fm=jpg&q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Golden Temple",
    image: "https://images.unsplash.com/photo-1776361160041-919578bbec19?fm=jpg&q=80&w=1600&auto=format&fit=crop"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected. Updating photos...");

    for (const item of updates) {
      const result = await Place.updateOne(
        { name: item.name },
        { $set: { image: item.image } }
      );
      console.log(item.name, "- matched:", result.matchedCount, "modified:", result.modifiedCount);
    }

    console.log("Photo update complete.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Error:", error);
  });