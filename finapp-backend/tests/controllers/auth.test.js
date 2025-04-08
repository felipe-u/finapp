const authController = require("../../controllers/auth");
const { findOne } = require("../../models/personalInfo");
const { User, Admin, Manager, Assistant } = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../models/user", () => ({
  User: { findOne: jest.fn() },
  Admin: jest.fn(),
  Manager: jest.fn(),
  Assistant: jest.fn(),
}));
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Register Controller", () => {
  let mockReq,
    mockRes,
    mockNext,
    mockJson,
    mockStatus,
    mockSave,
    mockUserInstance;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    mockRes = { status: mockStatus };
    mockNext = jest.fn();
    mockSave = jest.fn().mockResolvedValue();

    bcrypt.hash.mockReset();
    jwt.sign.mockReset();
    Admin.mockReset();
    Manager.mockReset();
    Assistant.mockReset();
  });

  it("should register a manager successfully", async () => {
    mockReq = {
      body: {
        name: "Juan Test",
        role: "manager",
        email: "juan@test.com",
        password: "password123",
        phone: "123456789",
      },
    };

    mockUserInstance = {
      name: "Juan Test",
      role: "manager",
      email: "juan@test.com",
      phone: "123456789",
      _id: "mocked-id-123",
      save: mockSave,
    };

    bcrypt.hash.mockResolvedValue("hashedPassword123");
    Manager.mockImplementation(() => mockUserInstance);
    jwt.sign.mockReturnValue("mocked-jwt-token");

    await authController.register(mockReq, mockRes, mockNext);

    expect(mockSave).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      message: "User registered successfully",
      user: {
        name: "Juan Test",
        role: "manager",
        email: "juan@test.com",
        phone: "123456789",
      },
      token: "mocked-jwt-token",
      expiresIn: 86400,
    });
  });

  it("should return 400 if role is invalid", async () => {
    mockReq = {
      body: {
        name: "Ana",
        role: "invalidRole",
        email: "ana@test.com",
        password: "password123",
        phone: "987654321",
      },
    };

    await authController.register(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ error: "Invalid role" });
  });

  it("should return 409 if user is already registered", async () => {
    mockReq = {
      body: {
        name: "Ana",
        role: "admin",
        email: "ana@test.com",
        password: "password123",
        phone: "987654321",
      },
    };

    mockSave = jest.fn().mockRejectedValue({
      code: 11000,
      message: "E11000 duplicate key error",
    });
    mockUserInstance = {
      ...mockReq.body,
      _id: "mocked-id-456",
      save: mockSave,
    };

    bcrypt.hash.mockResolvedValue("hashedPassword123");
    Admin.mockImplementation(() => mockUserInstance);

    await authController.register(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(409);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: "User already registered",
      error: "E11000 duplicate key error",
    });
  });

  it("should return 500 on unexpected save error", async () => {
    mockReq = {
      body: {
        name: "Carlos",
        role: "assistant",
        email: "carlos@test.com",
        password: "password123",
        phone: "111222333",
      },
    };

    mockSave = jest.fn().mockRejectedValue({ message: "Something went wrong" });
    mockUserInstance = {
      ...mockReq.body,
      _id: "mocked-id-789",
      save: mockSave,
    };

    bcrypt.hash.mockResolvedValue("hashedPassword123");
    Assistant.mockImplementation(() => mockUserInstance);

    await authController.register(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: "Error registering user",
      error: "Something went wrong",
    });
  });
});

describe("Login Controller", () => {
  let mockReq, mockRes, mockNext, mockJson, mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    mockRes = { status: mockStatus };
    mockNext = jest.fn();

    User.findOne.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
  });

  it("should login successfully with valid credentials", async () => {
    mockReq = {
      body: {
        email: "juan@test.com",
        password: "password123",
      },
    };

    const mockUser = {
      _id: "mocked-id-1",
      name: "Juan",
      role: "manager",
      email: "juan@test.com",
      phone: "123456789",
      photo: "photo.jpg",
      language: "en",
      password: "hashedPassword",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocked-login-token");

    await authController.login(mockReq, mockRes, mockNext);

    expect(User.findOne).toHaveBeenCalledWith({ email: "juan@test.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: "mocked-id-1",
        name: "Juan",
        role: "manager",
        email: "juan@test.com",
        phone: "123456789",
        photo: "photo.jpg",
        lang: "en",
      },
      token: "mocked-login-token",
      expiresIn: 86400,
    });
  });

  it("should return 404 if user not found", async () => {
    mockReq = {
      body: {
        email: "noexiste@test.com",
        password: "password123",
      },
    };

    User.findOne.mockResolvedValue(null);

    await authController.login(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should return 401 if password is incorrect", async () => {
    const mockUser = {
      _id: "mocked-id-2",
      name: "Ana",
      email: "ana@test.com",
      password: "hashedPassword",
    };

    mockReq = {
      body: {
        email: "ana@test.com",
        password: "wrongpassword",
      },
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: "Invalid password" });
  });

  it("should return 500 if an error occurs", async () => {
    mockReq = {
      body: {
        email: "carlos@test.com",
        password: "password123",
      },
    };

    User.findOne.mockRejectedValue(new Error("DB Error"));

    await authController.login(mockReq, mockRes, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: "Error logging in",
      error: "DB Error",
    });
  });
});
