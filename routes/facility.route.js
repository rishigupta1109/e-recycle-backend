const {
  createFacility,
  updateFacilityStatus,
} = require("../controller/facility.controller");

const router = require("express").Router();

router.post("/register", createFacility);
router.get("/verified", updateFacilityStatus);

exports.facilityRoutes = router;
