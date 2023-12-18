const User = require("../models/User.model");
const HttpError = require("../models/HttpError");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const OtpModel = require("../models/Otp.model");
const UserModel = require("../models/User.model");

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }
  const { email, password } = req.body;
  console.log(req.body);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return next(new HttpError("User does not exists", 422));
    }
    if (!existingUser.userType || existingUser?.userType !== "admin") {
      return next(new HttpError("User is not admin", 422));
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return next(new HttpError("Invalid credentials", 401));
    }
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.SECRET_KEY
    );
    res.status(200).json({
      id: existingUser._id,
      email: existingUser.email,
      token: token,
      name: existingUser.name,
      phoneNumber: existingUser.phoneNumber,
      credits: existingUser.credits,
      userType: existingUser.userType,
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Login failed, please try again later", 500));
  }
};

// exports.updateUser = async (req, res, next) => {
//   const { userId, name, dailyGoal, revisitDays, college } = req.body;
//   console.log(req.body);
//   try {
//     const user = await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         name: name,
//         dailyGoal: parseInt(dailyGoal) || 0,
//         revisitDays: parseInt(revisitDays) || 0,
//         college,
//       }
//     );
//     res.status(200).json({
//       user: user,
//       message: "User updated successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     return next(new HttpError("Something went wrong", 500));
//   }
// };

// const mail = (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "thebookbajaar@gmail.com",
//       pass: "yihuoxpbqpcqhobv",
//     },
//   });

//   const mailOptions = {
//     from: "thebookbajaar@gmail.com",
//     to: email,
//     subject: `OTP to set password`,
//     text: `The otp to set your password is ${otp}. Thanks,Sheet Code`,
//     replyTo: "thebookbajaar@gmail.com",
//   };
//   transporter.sendMail(mailOptions, function (err, res) {
//     if (err) {
//       console.error("there was an error: ", err);
//     } else {
//       console.log("here is the res: ", res);
//     }
//   });
// };
// const generateOtp = async (req, res, next) => {
//   let email = req.body.email;
//   if (!email) {
//     return next(new HttpError("Email is required", 404));
//   }
//   let user;
//   try {
//     user = await User.findOne({ email: email });
//   } catch (err) {
//     console.log(err);
//     return next(new HttpError("something went wrong", 404));
//   }
//   if (!user) {
//     return next(new HttpError("User not found", 404));
//   }
//   if (user) {
//     let code = await OtpModel.findOne({ email: email });
//     let otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
//     if (code) {
//       code.expiresIn = new Date().getTime() + 300 * 1000;
//       code.code = otp;
//       try {
//         await code.save();
//       } catch (err) {
//         console.log(err);
//         return next(new HttpError("something went wrong", 404));
//       }
//     } else {
//       code = new OtpModel({
//         email: email,
//         code: otp,
//         expiresIn: new Date().getTime() + 300 * 1000,
//       });
//       try {
//         await code.save();
//       } catch (err) {
//         console.log(err);
//         return next(new HttpError("something went wrong", 404));
//       }
//     }
//     mail(email, otp);
//     res.json({ message: "otp sent to your number", status: "success" });
//   } else {
//     return next(new HttpError("user does not exists", 404));
//   }
// };
// const checkOtp = async (req, res, next) => {
//   const { email, password, otp } = req.body;
//   console.log(req.body);
//   if (!email || !password || !otp) {
//     return next(new HttpError("All fields are required", 404));
//   }
//   let userOtp;
//   try {
//     userOtp = await OtpModel.findOne({ email: email, code: otp });
//   } catch (err) {
//     console.log(err);
//     return next(new HttpError("something went wrong", 404));
//   }
//   if (userOtp) {
//     let expiry = new Date(userOtp.expiresIn);
//     if (expiry > new Date()) {
//       let user;
//       try {
//         user = await User.findOne({ email: email });
//       } catch (err) {
//         console.log(err);
//         return next(new HttpError("something went wrong", 500));
//       }
//       let hashedPassword;
//       try {
//         hashedPassword = await bcrypt.hash(password, 12);
//       } catch (err) {
//         console.log(err);
//         return next(
//           new HttpError("something went wrong , please try again later", 500)
//         );
//       }
//       user.password = hashedPassword;
//       try {
//         console.log(userOtp);
//         await user.save();
//       } catch (err) {
//         console.log(err);
//         return next(
//           new HttpError("something went wrong , please try again later", 500)
//         );
//       }

//       res.json({ message: "password changed succesfuuly", status: "success" });
//     } else {
//       return next(new HttpError("Otp expired", 404));
//     }
//   } else {
//     return next(new HttpError("wrong otp", 404));
//   }
// };
// exports.generateOtp = generateOtp;
// exports.checkOtp = checkOtp;

// exports.generateOtpforRegister = async (req, res, next) => {
//   const { email, username: userName } = req.body;
//   if (!email || !userName) {
//     return next(new HttpError("All fields are required", 404));
//   }
//   let user;
//   try {
//     user = await UserModel.findOne({
//       $or: [
//         { email: email },
//         {
//           username: userName,
//         },
//       ],
//     });
//     if (user) {
//       return next(new HttpError("User already exists", 404));
//     }
//     let code = await OtpModel.findOne({ email: email });
//     let otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
//     if (code) {
//       code.expiresIn = new Date().getTime() + 300 * 1000;
//       code.code = otp;
//       try {
//         await code.save();
//       } catch (err) {
//         console.log(err);
//         return next(new HttpError("something went wrong", 404));
//       }
//     } else {
//       code = new OtpModel({
//         email: email,
//         code: otp,
//         expiresIn: new Date().getTime() + 300 * 1000,
//       });
//       try {
//         await code.save();
//       } catch (err) {
//         console.log(err);
//         return next(new HttpError("something went wrong", 404));
//       }
//     }
//     mail(email, otp);
//     res.json({ message: "otp sent to your email", status: "success" });
//   } catch (err) {
//     console.log(err);
//     return next(new HttpError("something went wrong", 404));
//   }
// };
// exports.checkOtpforRegister = async (req, res, next) => {
//   const { email, otp } = req.body;
//   console.log(req.body);
//   if (!email || !otp) {
//     return next(new HttpError("All fields are required", 404));
//   }
//   let userOtp;
//   try {
//     userOtp = await OtpModel.findOne({ email: email, code: otp });
//   } catch (err) {
//     console.log(err);
//     return next(new HttpError("something went wrong", 404));
//   }
//   if (userOtp) {
//     let expiry = new Date(userOtp.expiresIn);
//     if (expiry > new Date()) {
//       res.status(200).json({ message: "correct otp", status: 200 });
//     } else {
//       return next(new HttpError("Otp expired", 404));
//     }
//   } else {
//     return next(new HttpError("wrong otp", 404));
//   }
// };
