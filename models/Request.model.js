const mongoose = require("mongoose");
const Request = mongoose.Schema({
  deviceType: {
    type: String,
    required: true,
  },
  recycleItem: {
    type: String,
    required: true,
  },

  recycleItemPrice: {
    type: Number,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  pickupTimeSlot: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  facility: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Request", Request);
