const {
  createFacility,
  updateFacilityStatus,
  getFacilities,
  blockFacilityStatus,
  login,
  getRequests,
  updateRequest,
} = require("../controller/facility.controller");

const router = require("express").Router();
router.get("/", getFacilities);
router.post("/register", createFacility);
router.get("/verified", updateFacilityStatus);
router.get("/block", blockFacilityStatus);
router.post("/login", login);
router.get("/requests", getRequests);
router.post("/requests", updateRequest);

exports.facilityRoutes = router;
