const nodemailer = require("nodemailer");

const mail = (email, subject, message, file) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "@gmail.com",
      pass: "",
    },
  });

  const mailOptions = {
    from: "@gmail.com",
    to: email,
    subject: subject,
    text: message,
    replyTo: "@gmail.com",
    attachments: [
      {
        filename: "certificate.pdf",
        path: file,
        contentType: "application/pdf",
      },
    ],
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
