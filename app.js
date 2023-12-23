const HttpError = require("./models/HttpError");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { logExecutionTime } = require("mongoose-execution-time");
const bodyParser = require("body-parser");
var cors = require("cors");
app.use(bodyParser.json());
mongoose.plugin(logExecutionTime);
app.use(cors());

//routes
const { userRoutes } = require("./routes/User.route");
const { dataRoutes } = require("./routes/Data.route");
const { facilityRoutes } = require("./routes/facility.route");
const { adminRoutes } = require("./routes/admin.route");
const { generateCertificate } = require("./controller/certificateGenerator");

app.use("/api/user", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res, next) => {
  return next(new HttpError("could not find this route", 404));
});
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "an unknown error occured" });
});
generateCertificate("Rishi Gupta");
mongoose
  .connect(
    `mongodb+srv://:@cluster0.qhhctyw.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
