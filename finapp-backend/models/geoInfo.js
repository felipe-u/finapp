const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geoInfoSchema = new Schema({
  address: {
    country: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  googleMapsUrl: {
    type: String,
  },
  images: [String],
});

module.exports = mongoose.model("GeoInfo", geoInfoSchema);
