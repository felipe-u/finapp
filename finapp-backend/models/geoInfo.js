const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geoInfoSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  neighbourhood: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [long, lat]
      required: true,
    },
  },
  googleMapsUrl: {
    type: String,
  },
  propertyImages: [String],
});

module.exports = mongoose.model("GeoInfo", geoInfoSchema);
