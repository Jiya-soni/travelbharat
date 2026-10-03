const mongoose = require("mongoose");

// This defines exactly what fields every "Place" document will have.
const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true   // every place MUST have a name
  },
  state: {
    type: String,
    required: true    // which state this place belongs to
  },
  city: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true    // Heritage, Nature, Religious, Adventure
  },
  description: {
    type: String,
    default: ""       // optional - can stay empty for now
  },
  timings: {
    type: String,
    default: ""
  },
  entryFee: {
    type: String,
    default: ""
  },
  bestTime: {
    type: String,
    default: ""
  },
  famousFood: {
    type: String,
    default: ""
  },
  nearby: {
    type: String,
    default: ""
  },
  transport: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""        // will hold a photo URL, once we add photos
  }
});

// This turns our "shape" into an actual usable Model,
// which is what lets us save/read/update/delete places in MongoDB.
module.exports = mongoose.model("Place", placeSchema);