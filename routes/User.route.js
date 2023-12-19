const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller.js");
const checkAuth = require("../middlewares/check-auth");
const { check } = require("express-validator");
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
);
// router.post("/otp", userController.generateOtpforRegister);
// router.post("/otpverify", userController.checkOtpforRegister);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.login
);
router.post("/validate", userController.validateToken);
// router.patch("/update", checkAuth, userController.updateUser);
// router.post("/reset", userController.generateOtp);
// router.post("/reset-otpverify", userController.checkOtp);
exports.userRoutes = router;
