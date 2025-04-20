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
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  googleMapsUrl: {
    type: String,
  },
  propertyImages: [String],
  isSimulated: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("GeoInfo", geoInfoSchema);
