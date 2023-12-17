// Import necessary modules
const { hash } = require("bcryptjs");
const Facility = require("../models/facility.model");
const mail = require("./mail.controller");
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
      status: "pending", // Set initial status to pending
    });

    // Save the facility to the database
    await facility.save();

    // Return success response
    res.status(201).json({ message: "Applied for facility registration" });
  } catch (error) {
    // Return error response
    res.status(500).json({ error: "Failed to create facility" });
  }
};
// Update facility status to verified
const updateFacilityStatus = async (req, res) => {
  try {
    // Get facility ID from request parameters
    const { facilityId } = req.params;

    // Find the facility by ID
    const facility = await Facility.findById(facilityId);

    // Update the facility status to verified
    facility.status = "verified";
    const password = generatePassword();

    // Save the password in the facility model
    facility.password = hash(password, 12);

    // Save the updated facility
    await facility.save();

    // Email the password to the facility
    await mail(facility.email, `Your password is ${password}`);

    // Ret
    // Return success response
    res.json({ message: "Facility status updated to verified" });
  } catch (error) {
    // Return error response
    res.status(500).json({ error: "Failed to update facility status" });
  }
};

// Export the controller functions
module.exports = {
  createFacility,
  updateFacilityStatus,
};
