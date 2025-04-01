const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res, next) => {
  const { from, subject, body } = req.body.email;
  if (!from || !subject || !body) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "soporte.finapp@gmail.com",
        pass: "amoz cejt vlfg simh",
      },
    });

    await transporter.sendMail({
      from,
      to: "soporte.finapp@gmail.com",
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
