const {
  createRequest,
  getRequests,
  deleteRequest,
} = require("../controller/data.controller");
const checkAuth = require("../middlewares/check-auth");
const isAdmin = require("../middlewares/isAdmin");

const router = require("express").Router();

router.post("/create-request", createRequest);
router.get("/get-requests", getRequests);
// router.patch("/update-user", checkAuth, updateUser);
router.delete("/delete-request", deleteRequest);
exports.dataRoutes = router;
