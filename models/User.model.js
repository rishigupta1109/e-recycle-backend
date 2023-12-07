const mongoose = require("mongoose");
const User = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true, // unique index and unique constraint
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    default: 0,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  requests: {
    type: Array,
    default: [],
  },
});
module.exports = mongoose.model("User", User);
