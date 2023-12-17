const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller.js");
const checkAuth = require("../middlewares/check-auth");
const { check } = require("express-validator");

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  adminController.login
);
// router.patch("/update", checkAuth, userController.updateUser);
// router.post("/reset", userController.generateOtp);
// router.post("/reset-otpverify", userController.checkOtp);
exports.adminRoutes = router;
