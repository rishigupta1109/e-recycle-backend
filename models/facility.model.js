const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  facilityName: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  registrationNumber: {
    type: String,
    required: true,
  },
  status: { type: String, required: true },
  password: { type: String },
});

module.exports = mongoose.model("Facility", FacilitySchema);
