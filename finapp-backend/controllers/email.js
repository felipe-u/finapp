const nodemailer = require("nodemailer");
require("dotenv").config();

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

exports.sendEmail = async (req, res, next) => {
  const { from, subject, body } = req.body.email;
  if (!from || !subject || !body) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from,
      to: MAIL_USER,
      subject,
      text: `Mensage de: ${from}\n\n${body}`,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error sending email",
      error: error.message,
    });
  }
};
