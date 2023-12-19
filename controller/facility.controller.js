// Import necessary modules
const { hash, compare } = require("bcryptjs");
const Facility = require("../models/facility.model");
const UserModel = require("../models/User.model");
const mail = require("./mail.controller");
const HttpError = require("../models/HttpError");
const { sign } = require("jsonwebtoken");
const RequestModel = require("../models/Request.model");
// Create a facility
const createFacility = async (req, res) => {
  try {
    // Get facility data from request body
    const {
      facilityName,
      email,
      state,
      city,
      pincode,
      address,
      phone,
      website,
      registrationNumber,
      lat,
      lng,
    } = req.body;

    // Create a new facility
    const facility = new Facility({
      facilityName,
      email,
      state,
      city,
      pincode,
      address,
      phone,
      website,
      registrationNumber,
      lat,
      lng,
      status: "pending", // Set initial status to pending
    });

    // Save the facility to the database
    await facility.save();
    mail(
      email,
      "Facility registration request received",
      "Your facility registration request has been received. You will be notified once your account is verified."
    );
    // Return success response
    res.status(201).json({ message: "Applied for facility registration" });
  } catch (error) {
    // Return error response
    res.status(500).json({ error: "Failed to create facility" });
  }
};
// Update facility status to verified
const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};
const updateFacilityStatus = async (req, res) => {
  try {
    // Get facility ID from request parameters
    const { facilityId } = req.query;

    // Find the facility by ID
    const facility = await Facility.findById(facilityId);

    // Update the facility status to verified
    facility.status = "verified";
    const password = generatePassword();

    // Save the password in the facility model
    facility.password = await hash(password, 12);

    // Save the updated facility
    await facility.save();

    // Email the password to the facility
    await mail(
      facility.email,
      "Congratulations! Your account is verified",
      `Your password is ${password}`
    );

    // Ret
    // Return success response
    res.json({ message: "Facility status updated to verified" });
  } catch (error) {
    console.log(error);
    // Return error response
    res.status(500).json({ error: "Failed to update facility status" });
  }
};
const blockFacilityStatus = async (req, res) => {
  try {
    // Get facility ID from request parameters
    const { facilityId } = req.query;

    // Find the facility by ID
    const facility = await Facility.findById(facilityId);

    // Update the facility status to verified
    facility.status = "blocked";

    // Save the updated facility
    await facility.save();

    // Email the password to the facility
    await mail(
      facility.email,
      `Your Account is blocked`,
      "The admin have blocked your account contact to unblock on this email"
    );

    // Ret
    // Return success response
    res.json({ message: "Facility status updated to blocked" });
  } catch (error) {
    console.log(error);
    // Return error response
    res.status(500).json({ error: "Failed to update facility status" });
  }
};
const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ error: "Failed to get facilities" });
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  let existingUser;
  try {
    existingUser = await Facility.findOne({ email: email });
    if (!existingUser) {
      return next(new HttpError("User does not exists", 422));
    }
    if (existingUser.status === "pending") {
      return next(new HttpError("User is not verified", 422));
    }
    if (existingUser.status === "blocked") {
      return next(new HttpError("User is blocked", 422));
    }
    const isPasswordValid = await compare(password, existingUser.password);
    if (!isPasswordValid) {
      return next(new HttpError("Invalid credentials", 401));
    }
    const token = sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.SECRET_KEY
    );
    res.status(200).json({
      token: token,
      userType: "facility",
      ...existingUser._doc,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Login failed, please try again later", 500));
  }
};
const getRequests = async (req, res) => {
  try {
    const requests = await RequestModel.find({
      facility: req.query.facilityId,
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to get requests" });
  }
};
const updateRequest = async (req, res) => {
  try {
    const request = req.body;
    const id = request._id;
    const updatedRequest = await RequestModel.findByIdAndUpdate(id, request, {
      new: true,
    });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status === "Accepted") {
      mail(
        request.userEmail,
        "Request accepted",
        `Your request has been accepted. Please login to your account to view the request.`
      );
    } else if (request.status === "Rejected") {
      mail(
        request.userEmail,
        "Request rejected",
        `Your request has been rejected. Please login to your account to view the request.`
      );
    } else if (request.status === "Recieved") {
      console.log(request);
      const updatedUser = await UserModel.findByIdAndUpdate(request.userId, {
        $inc: { credits: request.credits },
      });
      console.log(updatedUser);

      mail(
        request.userEmail,
        "Item Recieved By facility",
        `Your Item has been Recieved. ${request.credits} credits has been added to your account. Please login to your account to view the request.}`
      );
    } else {
      mail(
        request.userEmail,
        "Request completed",
        `Your request has been Updated by Facility. Please login to your account to view the request.`
      );
    }

    res.json({ message: "Request updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update request" });
  }
};
// Export the controller functions
module.exports = {
  createFacility,
  updateFacilityStatus,
  getFacilities,
  blockFacilityStatus,
  login,
  getRequests,
  updateRequest,
};
