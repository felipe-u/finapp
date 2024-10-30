const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const geoInfoSchema = new Schema({
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
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
