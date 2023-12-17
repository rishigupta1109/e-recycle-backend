const nodemailer = require("nodemailer");

const mail = (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thebookbajaar@gmail.com",
      pass: "yihuoxpbqpcqhobv",
    },
  });

  const mailOptions = {
    from: "thebookbajaar@gmail.com",
    to: email,
    subject: subject,
    text: message,
    replyTo: "thebookbajaar@gmail.com",
  };
  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      console.error("there was an error: ", err);
    } else {
      console.log("here is the res: ", res);
    }
  });
};

module.exports = mail;
