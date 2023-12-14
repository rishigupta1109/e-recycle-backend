const HttpError = require("../models/HttpError");
const RequestModel = require("../models/Request.model");
var ObjectId = require("mongoose").Types.ObjectId;

exports.createRequest = async (req, res, next) => {
  const {
    deviceType,
    recycleItem,
    recycleItemPrice,
    pickupDate,
    pickupTimeSlot,
    phoneNumber,
    userId,
    facility,
    image,
    status,
    address,
    name,
    userEmail,
  } = req.body;
  console.log(req.body);
  const newRequest = new RequestModel({
    deviceType,
    recycleItem,
    recycleItemPrice,
    pickupDate,
    pickupTimeSlot,
    phoneNumber,
    userId,
    facility,
    image,
    status,
    address,
    name,
    createdAt: new Date(),
    userEmail,
  });
  console.log(newRequest);
  try {
    await newRequest.save();
    res.status(201).json({ message: "Request created successfully" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Request creation failed", 500);
    return next(error);
  }
};
exports.getRequests = async (req, res, next) => {
  const { id } = req.query;
  console.log(id);
  try {
    let requests;
    requests = await RequestModel.find({
      userId: id,
    });
    res.status(200).json({ requests: requests });
  } catch (err) {
    const error = new HttpError("Fetching requests failed", 500);
    return next(error);
  }
};

exports.deleteRequest = async (req, res, next) => {
  const { id } = req.query;
  try {
    await RequestModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    const error = new HttpError("Deleting request failed", 500);
    return next(error);
  }
};
