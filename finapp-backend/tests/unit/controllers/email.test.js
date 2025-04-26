const emailController = require("../../../controllers/email");
const nodemailer = require("nodemailer");
require("dotenv").config();

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

jest.mock("nodemailer");

describe("POST /send-email", () => {
  let req, res, next, mockSendMail;

  beforeEach(() => {
    req = {
      body: {
        email: {
          from: "user@example.com",
          subject: "Test Subject",
          body: "This is the body",
        },
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockSendMail = jest.fn().mockResolvedValue("Email sent");
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  it("shoud send the emai successfully", async () => {
    await emailController.sendEmail(req, res, next);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      from: "user@example.com",
      to: MAIL_USER,
      subject: "Test Subject",
      text: "Mensage de: user@example.com\n\nThis is the body",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email sent successfully",
    });
  });

  it("should return 400 if any field is missing", async () => {
    req.body.email = { from: "", subject: "", body: "" };

    await emailController.sendEmail(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields required" });
  });

  it("should return 500 if sendMail throws an error", async () => {
    const error = new Error("SMTP Error");
    mockSendMail.mockRejectedValue(error);

    await emailController.sendEmail(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error sending email",
      error: "SMTP Error",
    });
  });
});
