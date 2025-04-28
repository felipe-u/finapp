const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../../app");
const { User, Admin, Manager } = require("../../models/user");

jest.mock("../../models/user", () => ({
  User: {
    findOne: jest.fn(),
  },
  Admin: jest.fn(),
  Manager: jest.fn(),
}));

process.env.JWT_SECRET = "testsecret";

describe("Auth Routes - Integration (mocked DB)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const hashedPassword = await bcrypt.hash("Password123", 10);

      const mockUser = {
        _id: "mockid123",
        name: "Mock User",
        role: "manager",
        email: "mock@example.com",
        phone: "123456789",
        photo: null,
        language: "en",
        password: hashedPassword,
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "mock@example.com", password: "Password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("mock@example.com");
      expect(res.body.token).toBeDefined();
    });

    it("should return 404 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "nouser@example.com", password: "pass" });

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it("should return 401 if password is incorrect", async () => {
      const mockUser = {
        password: await bcrypt.hash("CorrectPass", 10),
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "mock@example.com", password: "WrongPass" });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid password/i);
    });
  });

  describe("POST /auth/register", () => {
    it("should register a new admin successfully", async () => {
      const mockSave = jest.fn().mockResolvedValue({
        _id: "admin123",
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
        phone: "123456789",
      });
      Admin.mockImplementation(function () {
        return {
          name: "Admin User",
          role: "admin",
          email: "admin@example.com",
          phone: "123456789",
          save: mockSave,
        };
      });

      const res = await request(app).post("/auth/register").send({
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
        password: "AdminPass123",
        phone: "123456789",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("admin@example.com");
    });

    it("should return 400 for invalid role", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "User",
        role: "invalidRole",
        email: "user@example.com",
        password: "pass",
        phone: "000000",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid role/i);
    });

    it("should return 409 if user already exists", async () => {
      const mockSave = jest.fn(() => {
        const err = new Error("duplicate key");
        err.code = 11000;
        return Promise.reject(err);
      });
      Manager.mockImplementation(function () {
        return {
          save: mockSave,
        };
      });

      const res = await request(app).post("/auth/register").send({
        name: "Manager",
        role: "manager",
        email: "manager@example.com",
        password: "pass",
        phone: "999999",
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already registered/i);
    });
  });
});
