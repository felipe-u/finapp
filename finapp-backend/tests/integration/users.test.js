const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../../app");
const { User, Manager, Assistant } = require("../../models/user");
const ROUTES = require("../../utils/routesPaths");

jest.mock("../../models/user", () => ({
  User: {
    findById: jest.fn(),
  },
  Manager: {
    find: jest.fn(),
  },
  Assistant: {
    find: jest.fn(),
  },
}));
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hashSync: jest.fn(),
}));

describe("GET /users/all", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all managers and assistants", async () => {
    const mockManagers = [{ _id: "m1", name: "Alice" }];
    const mockAssistants = [{ _id: "a1", name: "Bob" }];

    Manager.find.mockResolvedValue(mockManagers);
    Assistant.find.mockResolvedValue(mockAssistants);

    const res = await request(app).get(ROUTES.USER.GET_ALL_USERS);

    expect(res.statusCode).toBe(200);
    expect(res.body.managers).toEqual(mockManagers);
    expect(res.body.assistants).toEqual(mockAssistants);
    expect(Manager.find).toHaveBeenCalledWith();
    expect(Assistant.find).toHaveBeenCalledWith();
  });

  it("should return filtered managers and assistants by search term", async () => {
    const searchTerm = "Al";
    const query = { name: { $regex: searchTerm, $options: "i" } };

    const mockManagers = [{ _id: "m1", name: "Alice" }];
    const mockAssistants = [];

    Manager.find.mockResolvedValue(mockManagers);
    Assistant.find.mockResolvedValue(mockAssistants);

    const res = await request(app).get(`/users/all?searchTerm=${searchTerm}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.managers).toEqual(mockManagers);
    expect(res.body.assistants).toEqual(mockAssistants);
    expect(Manager.find).toHaveBeenCalledWith(query);
    expect(Assistant.find).toHaveBeenCalledWith(query);
  });

  it("should return 500 if an error occurs", async () => {
    Manager.find.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get(ROUTES.USER.GET_ALL_USERS);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("GET /users", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user if found", async () => {
    const mockUser = { _id: "u1", name: "John Doe" };
    User.findById.mockResolvedValue(mockUser);

    const res = await request(app).get(`${ROUTES.USER.GET_USER}?userId=u1`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith("u1");
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).get(`${ROUTES.USER.GET_USER}?userId=u1`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
    expect(User.findById).toHaveBeenCalledWith("u1");
  });

  it("should return 500 if DB error occurs", async () => {
    User.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get(`${ROUTES.USER.GET_USER}?userId=u1`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("PUT /user-update", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user email and phone if user is found", async () => {
    const mockUser = {
      _id: "u1",
      email: "old@example.com",
      phone: "000000",
      save: jest.fn(),
    };
    User.findById.mockResolvedValue(mockUser);

    const res = await request(app).put(ROUTES.USER.UPD_USER).send({
      userId: "u1",
      email: "new@example.com",
      phone: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User updated successfully!");
    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(mockUser.email).toBe("new@example.com");
    expect(mockUser.phone).toBe("123456");
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).put(ROUTES.USER.UPD_USER).send({
      userId: "u1",
      email: "new@example.com",
      phone: "123456",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
    expect(User.findById).toHaveBeenCalledWith("u1");
  });

  it("should return 500 if DB error occurs", async () => {
    User.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app).put(ROUTES.USER.UPD_USER).send({
      userId: "u1",
      email: "new@example.com",
      phone: "123456",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("POST /check-password", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if password matches", async () => {
    const mockUser = {
      _id: "u1",
      password: "hashedPassword",
    };
    User.findById.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post(ROUTES.USER.CHECK_PASS).send({
      userId: "u1",
      oldPassword: "plaintextPassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(true);
    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "plaintextPassword",
      "hashedPassword"
    );
  });

  it("should return false if password does not match", async () => {
    const mockUser = {
      _id: "u1",
      password: "hashedPassword",
    };
    User.findById.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post(ROUTES.USER.CHECK_PASS).send({
      userId: "u1",
      oldPassword: "wrongPassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(false);
    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongPassword",
      "hashedPassword"
    );
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).post(ROUTES.USER.CHECK_PASS).send({
      userId: "u1",
      oldPassword: "anyPassword",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  it("should return 500 on server error", async () => {
    User.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app).post(ROUTES.USER.CHECK_PASS).send({
      userId: "u1",
      oldPassword: "anyPassword",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("POST /change-password", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should change the user's password if user is found", async () => {
    const mockSave = jest.fn();
    const mockUser = {
      _id: "u1",
      password: "oldHashedPass",
      save: mockSave,
    };
    User.findById.mockResolvedValue(mockUser);
    bcrypt.hashSync.mockReturnValue("newHashedPass");

    const res = await request(app).post(ROUTES.USER.CHANGE_PASS).send({
      userId: "u1",
      newPassword: "myNewPass123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Password changed successfully");
    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(bcrypt.hashSync).toHaveBeenCalledWith("myNewPass123");
    expect(mockUser.password).toBe("newHashedPass");
    expect(mockSave).toHaveBeenCalled();
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).post(ROUTES.USER.CHANGE_PASS).send({
      userId: "u1",
      newPassword: "irrelevant",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  it("should return 500 if an error occurs", async () => {
    User.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app).post(ROUTES.USER.CHANGE_PASS).send({
      userId: "u1",
      newPassword: "somePass",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("POST /change-lang", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should change the user's language if user is found", async () => {
    const mockSave = jest.fn();
    const mockUser = {
      _id: "u1",
      language: "en",
      save: mockSave,
    };
    User.findById.mockResolvedValue(mockUser);

    const res = await request(app).post(ROUTES.USER.CHANGE_LANG).send({
      userId: "u1",
      newLang: "es",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Language changed successfully");
    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(mockUser.language).toBe("es");
    expect(mockSave).toHaveBeenCalled();
  });

  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).post(ROUTES.USER.CHANGE_LANG).send({
      userId: "u1",
      newLang: "fr",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  it("should return 500 if an error occurs", async () => {
    User.findById.mockRejectedValue(new Error("DB crash"));

    const res = await request(app).post(ROUTES.USER.CHANGE_LANG).send({
      userId: "u1",
      newLang: "de",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Server error");
    expect(res.body).toHaveProperty("error", "DB crash");
  });
});
