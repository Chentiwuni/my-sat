const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//define satellite schema
const SatelliteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});

// Virtual for satellite detail URL
SatelliteSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/my-sat/track_satellite/${this._id}`;
  });

  //export model
  module.exports = mongoose.model("Satellite", SatelliteSchema);